import Form from '@/app/ui/dashboard/products/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
 
export default async function Page() { 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Create Product',
            href: '/dashboard/products/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}