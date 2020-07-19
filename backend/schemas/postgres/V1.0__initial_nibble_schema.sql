CREATE TABLE "restaurant" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	"disclaimer" TEXT NOT NULL,
	"logo_url" json NOT NULL,
	"hero_url" json NOT NULL,
	"street_address" TEXT NOT NULL,
	"dependent_locality" TEXT,
	"locality" TEXT NOT NULL,
	"administrative_area" TEXT NOT NULL,
	"country" TEXT NOT NULL,
	"postal_code" TEXT NOT NULL,
	"latitude" double NOT NULL,
	"longitude" double NOT NULL,
	"longitude" double NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT 'clock_timestamp()',
	CONSTRAINT "restaurant_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "nibble" (
	"id" serial NOT NULL,
	"restaurant_id" bigint NOT NULL,
	"name" TEXT NOT NULL,
	"type" TEXT NOT NULL,
	"available_count" int NOT NULL,
	"description" TEXT,
	"price" int NOT NULL,
	"available_from" bigint NOT NULL,
	"available_to" bigint NOT NULL,
	"image_url" json NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT 'clock_timestamp()',
	CONSTRAINT "nibble_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "nibble_reservation" (
	"id" serial NOT NULL,
	"nibble_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"reserved_count" int NOT NULL,
	"reserved_at" bigint NOT NULL,
	"price" int NOT NULL,
	"status" TEXT NOT NULL,
	"cancelled_at" bigint,
	"cancellation_reason" TEXT,
	CONSTRAINT "nibble_reservation_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user" (
	"id" serial NOT NULL,
	"idp_id" bigint NOT NULL,
	"full_name" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"phone_number" TEXT NOT NULL,
	"postal_code" TEXT NOT NULL,
	"profile_url" json NOT NULL,
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "nibble" ADD CONSTRAINT "nibble_fk0" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id");

ALTER TABLE "nibble_reservation" ADD CONSTRAINT "nibble_reservation_fk0" FOREIGN KEY ("nibble_id") REFERENCES "nibble"("id");
ALTER TABLE "nibble_reservation" ADD CONSTRAINT "nibble_reservation_fk1" FOREIGN KEY ("user_id") REFERENCES "user"("id");

