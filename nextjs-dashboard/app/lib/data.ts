import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

const ITEMS_PER_PAGE_PRODUCTS = 6;
export async function fetchFilteredProducts(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCTS;

  try {
    // NOTE: This is a placeholder. You'll need to adapt this query to your actual database schema.
    // For now, we are filtering from the hardcoded products array.
    const products = [
      { id: '1', name: 'Kemeja Polo', description: 'Kemeja polo katun premium...', price: 250000, category: 'Pakaian Pria', imageUrl: '/products/Polo.jpg' },
      { id: '2', name: 'Celana Chino', description: 'Celana chino slim-fit...', price: 350000, category: 'Pakaian Pria', imageUrl: '/products/Chinos.jpg' },
      { id: '3', name: 'Celana Skena', description: 'Celana kargo dengan banyak...', price: 400000, category: 'Pakaian Pria', imageUrl: '/products/Celana.jpg' },
      { id: '4', name: 'Knitwear', description: 'Sweater rajut hangat...', price: 450000, category: 'Pakaian Unisex', imageUrl: '/products/Knitwear.jpg' },
      { id: '5', name: 'Rok', description: 'Rok lipit yang elegan...', price: 300000, category: 'Pakaian Wanita', imageUrl: '/products/Rok.jpg' },
    ];

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );

    return filteredProducts.slice(offset, offset + ITEMS_PER_PAGE_PRODUCTS);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProductsPage(query: string) {
    try {
        // Placeholder data
        const products = [
            { id: '1', name: 'Kemeja Polo', description: 'Kemeja polo katun premium...', price: 250000, category: 'Pakaian Pria', imageUrl: '/products/Polo.jpg' },
            { id: '2', name: 'Celana Chino', description: 'Celana chino slim-fit...', price: 350000, category: 'Pakaian Pria', imageUrl: '/products/Chinos.jpg' },
            { id: '3', name: 'Celana Skena', description: 'Celana kargo dengan banyak...', price: 400000, category: 'Pakaian Pria', imageUrl: '/products/Celana.jpg' },
            { id: '4', name: 'Knitwear', description: 'Sweater rajut hangat...', price: 450000, category: 'Pakaian Unisex', imageUrl: '/products/Knitwear.jpg' },
            { id: '5', name: 'Rok', description: 'Rok lipit yang elegan...', price: 300000, category: 'Pakaian Wanita', imageUrl: '/products/Rok.jpg' },
        ];

        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
        
        const totalPages = Math.ceil(Number(filteredProducts.length) / ITEMS_PER_PAGE_PRODUCTS);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of products.');
    }
}


export async function fetchProductById(id: string) {
  try {
    // Placeholder data
    const products = [
        { id: '1', name: 'Kemeja Polo', description: 'Kemeja polo katun premium...', price: 250000, category: 'Pakaian Pria', imageUrl: '/products/Polo.jpg' },
        { id: '2', name: 'Celana Chino', description: 'Celana chino slim-fit...', price: 350000, category: 'Pakaian Pria', imageUrl: '/products/Chinos.jpg' },
        { id: '3', name: 'Celana Skena', description: 'Celana kargo dengan banyak...', price: 400000, category: 'Pakaian Pria', imageUrl: '/products/Celana.jpg' },
        { id: '4', name: 'Knitwear', description: 'Sweater rajut hangat...', price: 450000, category: 'Pakaian Unisex', imageUrl: '/products/Knitwear.jpg' },
        { id: '5', name: 'Rok', description: 'Rok lipit yang elegan...', price: 300000, category: 'Pakaian Wanita', imageUrl: '/products/Rok.jpg' },
    ];
    const product = products.find(p => p.id === id);
    return product;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}