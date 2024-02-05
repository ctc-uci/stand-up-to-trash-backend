CREATE TABLE public.users
(
    id integer NOT NULL,
    first_name character varying(256) NOT NULL,
    last_name character varying(256) NOT NULL,
    role character varying(16) NOT NULL,
    email character varying(256),
    firebase_uid character varying(128),
    image_url character varying(512) DEFAULT 'https://i.pinimg.com/originals/a4/af/12/a4af1288eab8714320fa8453f72d79fd.jpg',
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;