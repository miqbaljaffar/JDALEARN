--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: Account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Account_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Account_id_seq" OWNER TO postgres;

--
-- Name: Account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Account_id_seq" OWNED BY public."Account".id;


--
-- Name: Cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cart" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Cart" OWNER TO postgres;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CartItem" (
    id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "cartId" integer NOT NULL,
    "productId" integer NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO postgres;

--
-- Name: CartItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CartItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CartItem_id_seq" OWNER TO postgres;

--
-- Name: CartItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CartItem_id_seq" OWNED BY public."CartItem".id;


--
-- Name: Cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Cart_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Cart_id_seq" OWNER TO postgres;

--
-- Name: Cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Cart_id_seq" OWNED BY public."Cart".id;


--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: News; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."News" (
    id integer NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,
    content text,
    "imageUrl" text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    author text NOT NULL
);


ALTER TABLE public."News" OWNER TO postgres;

--
-- Name: News_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."News_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."News_id_seq" OWNER TO postgres;

--
-- Name: News_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."News_id_seq" OWNED BY public."News".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id integer NOT NULL,
    "totalAmount" double precision NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "paymentMethod" text NOT NULL,
    "shippingAddress" text NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id integer NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    "orderId" integer NOT NULL,
    "productId" integer NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrderItem_id_seq" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrderItem_id_seq" OWNED BY public."OrderItem".id;


--
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Order_id_seq" OWNER TO postgres;

--
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    price double precision NOT NULL,
    "imageUrl" text NOT NULL,
    features jsonb NOT NULL,
    specifications jsonb,
    "categoryId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Product_id_seq" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id integer NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" integer NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: Session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Session_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Session_id_seq" OWNER TO postgres;

--
-- Name: Session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Session_id_seq" OWNED BY public."Session".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text,
    email text,
    password text,
    "phoneNumber" text,
    address text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    image text,
    role text DEFAULT 'CUSTOMER'::text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerificationToken" (
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO postgres;

--
-- Name: VerificationToken_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."VerificationToken_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VerificationToken_id_seq" OWNER TO postgres;

--
-- Name: VerificationToken_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."VerificationToken_id_seq" OWNED BY public."VerificationToken".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Account id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account" ALTER COLUMN id SET DEFAULT nextval('public."Account_id_seq"'::regclass);


--
-- Name: Cart id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart" ALTER COLUMN id SET DEFAULT nextval('public."Cart_id_seq"'::regclass);


--
-- Name: CartItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem" ALTER COLUMN id SET DEFAULT nextval('public."CartItem_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: News id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News" ALTER COLUMN id SET DEFAULT nextval('public."News_id_seq"'::regclass);


--
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- Name: OrderItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem" ALTER COLUMN id SET DEFAULT nextval('public."OrderItem_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: Session id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session" ALTER COLUMN id SET DEFAULT nextval('public."Session_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: VerificationToken id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerificationToken" ALTER COLUMN id SET DEFAULT nextval('public."VerificationToken_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cart" (id, "userId", "createdAt", "updatedAt") FROM stdin;
1	3	2025-07-25 07:14:34.088	2025-07-25 07:14:34.088
2	5	2025-07-28 15:15:56.941	2025-07-28 15:15:56.941
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CartItem" (id, quantity, "cartId", "productId") FROM stdin;
6	1	2	8
5	3	1	5
4	62	1	7
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name) FROM stdin;
1	Kemeja
2	Celana
3	Rok
4	Kaos
5	Pakaian Unisex
6	Pakaian Pria
7	Pakaian Wanita
\.


--
-- Data for Name: News; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."News" (id, title, excerpt, content, "imageUrl", slug, "createdAt", "updatedAt", author) FROM stdin;
2	Kiat Padu Padan Aksesoris untuk Tampil Beda	Ubah pakaian sederhana menjadi luar biasa dengan pilihan aksesoris yang tepat.	Aksesoris adalah kunci untuk personalisasi gaya. Jangan takut untuk bereksperimen. Kalung bertumpuk, gelang kulit, atau bahkan tas selempang yang unik dapat langsung meningkatkan penampilan Anda. Untuk tampilan kasual, coba padukan kaos putih polos dengan beberapa kalung perak. Untuk acara yang lebih formal, jam tangan klasik dan dasi dengan pola menarik akan menunjukkan perhatian Anda terhadap detail.	/news2.jpg	kiat-padu-padan-aksesoris	2025-07-25 08:13:41.998	2025-07-28 15:37:07.151	Rina Wijaya
3	Mengenal Bahan Berkelanjutan dalam Dunia Fashion	Ketahui lebih dalam tentang katun organik, linen, dan Tencel yang ramah lingkungan.	Seiring meningkatnya kesadaran akan lingkungan, industri fashion pun bergerak ke arah yang lebih hijau. Bahan-bahan seperti katun organik, yang ditanam tanpa pestisida berbahaya, dan linen, yang membutuhkan lebih sedikit air, menjadi semakin populer. Selain itu, inovasi seperti Tencel™, yang terbuat dari pulp kayu dari hutan yang dikelola secara lestari, menawarkan alternatif yang lembut, sejuk, dan dapat terurai secara hayati. Memilih pakaian dari bahan-bahan ini adalah langkah kecil yang berdampak besar bagi planet kita.	/news3.jpg	mengenal-bahan-berkelanjutan	2025-07-25 08:13:42.065	2025-07-28 15:37:07.188	Siti Amelia
10	Musim Panas	males	sjwejnfewjf	/products/3a106a59-f48b-420a-9f2a-56fb3f76bc2d.jpg	musim-panas	2025-07-25 09:02:57.412	2025-07-25 09:02:57.412	iqbal
1	5 Tren Fashion Pria yang Akan Mendominasi di Tahun 2025	Dari siluet longgar hingga warna-warna berani, inilah tampilan kunci yang perlu Anda ketahui.	Tahun 2025 menandai pergeseran signifikan dalam fashion pria. Desainer di seluruh dunia meninggalkan potongan yang sangat ketat dan merangkul kenyamanan dengan siluet yang lebih longgar dan mengalir. Celana berpotongan lebar, kemeja kebesaran, dan outerwear yang santai menjadi pusat perhatian. Selain itu, palet warna netral mulai digantikan oleh warna-warna yang lebih cerah dan berani seperti oranye terbakar, biru kobalt, dan hijau limau, memberikan pernyataan yang kuat namun tetap elegan.	/news1.jpg	tren-fashion-pria-2025	2025-07-25 08:13:41.302	2025-07-28 15:37:07.132	Andi Pratama
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "totalAmount", status, "userId", "createdAt", "updatedAt", "paymentMethod", "shippingAddress") FROM stdin;
1	297000	PENDING	3	2025-07-25 07:15:01.748	2025-07-25 07:15:01.748	mbanking	Baleendah
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, quantity, price, "orderId", "productId") FROM stdin;
1	3	99000	1	3
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, name, description, price, "imageUrl", features, specifications, "categoryId", "createdAt", "updatedAt") FROM stdin;
1	Rok	 ,,	99000	/products/2cfa2c24-850b-4729-97e6-5d6855d91d73.jpg	[]	{}	2	2025-07-25 07:07:42.345	2025-07-25 07:07:42.345
2	celana	sdqw	99000	/products/aab6ed37-52b8-451f-b60e-4168f1a3d3a9.jpg	[]	{}	2	2025-07-25 07:08:10.331	2025-07-25 07:08:10.331
3	kemeja	dw	99000	/products/Bahan_Nyaman_dan_Lembut___Detail_Produk__Lengkapi….jpg	[]	{}	1	2025-07-25 07:08:39.173	2025-07-25 07:08:39.173
4	kemeja	fewf	99000	/products/kemeja,_baju,_kemeja_pria,_baju_pria,_shirt_pria….jpg	[]	{}	1	2025-07-25 07:09:02.18	2025-07-25 07:09:02.18
5	kemeja	swefw	99000	/products/Matt_cotton_woll_&_flannel_Bahan….jpg	[]	{}	1	2025-07-25 07:09:27.396	2025-07-25 07:09:27.396
7	rok	edw	120000	/products/¡ELEGANCIA_SIN_ESFUERZO_A_CADA_PASO!_Actualiza_tu….jpg	[]	{}	3	2025-07-25 07:10:26.382	2025-07-25 07:10:26.382
8	rok	few	130000	/products/Encuentra_la_armonía_perfecta_entre_comodidad_y….jpg	[]	{}	3	2025-07-25 07:10:53.305	2025-07-25 07:10:53.305
9	rok	wefe	140000	/products/Enhance_your_wardrobe_with_this_elegant,_handmade….jpg	[]	{}	3	2025-07-25 07:11:21.842	2025-07-25 07:11:21.842
6	kemeja	wed32	120000	/products/Shirts,_clothes,_men's_shirts,_men's_clothes….jpg	[]	{}	1	2025-07-25 07:09:53.339	2025-07-25 07:12:02.265
10	Piyama	adem	70000	/products/piyama.webp	[]	{}	5	2025-07-28 17:51:10.53	2025-07-28 17:51:10.53
11	Pijamas	lembut	70000	/products/piyama2.webp	[]	{}	5	2025-07-28 17:51:37.114	2025-07-28 17:51:37.114
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, "phoneNumber", address, "createdAt", "updatedAt", "emailVerified", image, role) FROM stdin;
2	Customer User	customer@example.com	$2b$10$JQyj1KXW39JoP3XH0HZTeuxby7LnYpR0rVDyAIVtzn7saBDQB5Uti	\N	\N	2025-07-25 04:48:49.202	2025-07-25 04:48:49.202	\N	\N	CUSTOMER
3	miqbalj	miqbalj@gmail.com	$2b$10$O3.KHbttcziNx74VzoCumOEvzUBGWZ7v3fB8p8SJR064hw2i8kBGG	081388	Baleendah	2025-07-25 07:13:27.765	2025-07-25 07:14:16.632	\N	\N	CUSTOMER
4	Mohammad Iqbal Jaffar	iqbaljaffar1108@gmail.com	\N	\N	\N	2025-07-28 14:45:58.146	2025-07-28 14:45:58.146	2025-07-28 14:45:58.124	https://lh3.googleusercontent.com/a/ACg8ocK7FDr2RhZe1peiT7YY9kqavDXeVNAATQv91sRpMNeySSPugHhcow=s96-c	CUSTOMER
5	mrayyanj	iqbaljaffar0811@gmail.com	$2b$10$aBsC0ZBbVYCxSK5ObZxqxuxE.Ry1Eh3nldSdn2s16d1x04vRQ64.a	\N	\N	2025-07-28 14:52:35.284	2025-07-28 15:08:55.588	2025-07-28 15:08:55.563	\N	CUSTOMER
1	Admin User	admin@example.com	$2b$10$9a/F7NS6UiciNe5d4fN73uyDG.PcuCULw2oNVYeu0zywiEGnDlpCK	\N	\N	2025-07-25 04:48:49.091	2025-07-28 15:37:06.201	2025-07-28 15:37:06.171	\N	ADMIN
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerificationToken" (token, expires, "createdAt", email, id) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e29cadea-fc62-4a18-8826-62bd51e201d0	8c0f7b000ca3dc3a2a924da207692dbc8c98037907efa4a77455d35a969d207f	2025-07-25 11:48:23.691674+07	20250719111418_init	\N	\N	2025-07-25 11:48:23.504181+07	1
b36a485e-3a33-4c69-8cb8-9ecfda0a51c7	742df6e06e0ad61cca38852741865989534168e88f01a743b3a03c7285b22e70	2025-07-25 11:48:23.737228+07	20250719153918_add_nextauth_and_merge_user	\N	\N	2025-07-25 11:48:23.693577+07	1
62d22550-6f8b-4aff-a32a-4be67c8637ab	c868da0782e19947c6ce70336cf78b620d160e11a400524bbd2e2df1e5da76b1	2025-07-25 11:48:23.743924+07	20250719162718_add_user_role	\N	\N	2025-07-25 11:48:23.738547+07	1
3d26cebc-176d-4471-aa4d-77b4577b4c97	c78a553a5680991cae9c7330eee2067a8f10d9745fc7bd200468f6975c9bad06	2025-07-25 13:58:20.838188+07	20250725065819_add_order_shipping_details	\N	\N	2025-07-25 13:58:20.00828+07	1
e3e0420b-d848-4eec-9a08-5f7a7697df84	06930a7a90a4b4b6d2a0bf0e8f60e5bba53400f3d08fdcf9dcd321547379ece9	2025-07-25 14:56:04.575355+07	20250725075604_add_news_author	\N	\N	2025-07-25 14:56:04.310638+07	1
8ec50ef6-06a5-4a32-95aa-b5a1367f760c	a8f35281ffc8ddab589233967fe75f69148746fe76716c418ecc7bffff9b0a91	2025-07-28 21:01:11.956627+07	20250728140111_add_verification_token	\N	\N	2025-07-28 21:01:11.151673+07	1
91959e0d-92f1-4fff-9c69-ac28da366adc	9cb51e0b7636fa960d2bd9f801893d4151f9fbecb6d7514cfd9cd8926b70ca3d	2025-07-28 21:04:22.230281+07	20250728140422_make_user_password_optional	\N	\N	2025-07-28 21:04:22.108496+07	1
\.


--
-- Name: Account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Account_id_seq"', 1, false);


--
-- Name: CartItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CartItem_id_seq"', 6, true);


--
-- Name: Cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Cart_id_seq"', 2, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 7, true);


--
-- Name: News_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."News_id_seq"', 13, true);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 1, true);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_id_seq"', 1, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 11, true);


--
-- Name: Session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Session_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 6, true);


--
-- Name: VerificationToken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VerificationToken_id_seq"', 2, true);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: News News_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News"
    ADD CONSTRAINT "News_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VerificationToken VerificationToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerificationToken"
    ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: CartItem_cartId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON public."CartItem" USING btree ("cartId", "productId");


--
-- Name: Cart_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Cart_userId_key" ON public."Cart" USING btree ("userId");


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: News_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "News_slug_key" ON public."News" USING btree (slug);


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_email_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_email_token_key" ON public."VerificationToken" USING btree (email, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Cart Cart_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

