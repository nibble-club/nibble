CREATE TABLE restaurant (
	id serial NOT NULL,
	name text NOT NULL,
	description text NOT NULL,
	disclaimer text NOT NULL,
	logo_url json NOT NULL,
	hero_url json NOT NULL,
	market text NOT NULL,
	street_address text NOT NULL,
	dependent_locality text,
	locality text NOT NULL,
	administrative_area text NOT NULL,
	country text NOT NULL,
	postal_code text NOT NULL,
	latitude double precision NOT NULL,
	longitude double precision NOT NULL,
	active boolean NOT NULL,
	created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT restaurant_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);


CREATE TABLE restaurant_admin (
	id text NOT NULL,
	email text NOT NULL,
	created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT restaurant_admin_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE restaurant_restaurant_admin (
	restaurant_id bigint NOT NULL,
	admin_id text NOT NULL,
	CONSTRAINT restaurant_restaurant_admin_pk PRIMARY KEY (admin_id, restaurant_id)
) WITH (
	OIDS=FALSE
);


CREATE TABLE nibble (
	id serial NOT NULL,
	restaurant_id bigint NOT NULL,
	name text NOT NULL,
	type text NOT NULL,
	available_count int NOT NULL,
	description text,
	price int NOT NULL,
	available_from bigint NOT NULL,
	available_to bigint NOT NULL,
	image_url json NOT NULL,
	created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT nibble_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE nibble_reservation (
	id serial NOT NULL,
	nibble_id bigint NOT NULL,
	user_id text NOT NULL,
	reserved_count int NOT NULL,
	reserved_at bigint NOT NULL,
	price int NOT NULL,
	status text NOT NULL,
	cancelled_at bigint,
	cancellation_reason text,
	CONSTRAINT nibble_reservation_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE nibble_user (
	id text NOT NULL,
	full_name text NOT NULL,
	email text NOT NULL,
	phone_number text,
	postal_code text,
	profile_url json NOT NULL,
	created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT nibble_user_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);


ALTER TABLE restaurant_restaurant_admin ADD CONSTRAINT restaurant_restaurant_admin_fk0 FOREIGN KEY (admin_id) REFERENCES restaurant_admin(id);
ALTER TABLE restaurant_restaurant_admin ADD CONSTRAINT restaurant_restaurant_admin_fk1 FOREIGN KEY (restaurant_id) REFERENCES restaurant(id);


ALTER TABLE nibble ADD CONSTRAINT nibble_fk0 FOREIGN KEY (restaurant_id) REFERENCES restaurant(id);

ALTER TABLE nibble_reservation ADD CONSTRAINT nibble_reservation_fk0 FOREIGN KEY (nibble_id) REFERENCES nibble(id);
ALTER TABLE nibble_reservation ADD CONSTRAINT nibble_reservation_fk1 FOREIGN KEY (user_id) REFERENCES nibble_user(id);



CREATE INDEX restaurant_id_idx ON nibble(restaurant_id)