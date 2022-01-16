DROP TABLE IF EXISTS public.topen_positions;
CREATE TABLE public.topen_positions (
	position_id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	position_title varchar(200) NOT NULL,
	raised_by int4 NOT NULL,
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	exp_min_years int4 NULL,
	exp_max_years int4 NULL,
	location varchar(100),
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT pk_topen_positions PRIMARY KEY (position_id)
);

DROP TABLE IF EXISTS public.tposition_skills;
CREATE TABLE public.tskills (
	skill_id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	skill_name varchar(200) NOT NULL,
	skill_category_id int4 NOT NULL,
	is_active boolean not null default false,
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT pk_tposition_skills PRIMARY KEY (skill_id)
);

DROP TABLE IF EXISTS public.tposition_skill_link;
CREATE TABLE public.tposition_skill_link (
	position_id int4 not null,
	skill_id int4 not null,
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT pk_tposition_skill_link PRIMARY KEY (position_id,skill_id);

DROP TABLE IF EXISTS public.tposition_statuses;
CREATE TABLE public.tposition_statuses (
	pos_status_id int4 not null NOT NULL GENERATED ALWAYS AS IDENTITY,
	pos_status_name varchar(200) NOT NULL,
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT pk_tposition_statuses PRIMARY KEY (pos_status_id);

DROP TABLE IF EXISTS public.Tposition_status_link;
CREATE TABLE public.Tposition_status_link (
	position_id int4 not null,
	status_id int4 not null,
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT pk_tposition_status_link PRIMARY KEY (position_id,status_id);

DROP TABLE IF EXISTS tjob_candidates;
CREATE TABLE public.tjob_candidates(
	candidate_id int4 not null NOT NULL GENERATED ALWAYS AS IDENTITY,
	first_name varchar(200) NOT NULL,
	last_name varchar(200) NOT NULL,
	last_working_day timestamptz,
	source_name varchar(1000),
	unique_id varchar(1000),
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT pk_tjob_candidates PRIMARY KEY (Candidate_id);
	);


-- Interview type, Round 1 or Round 2 or Lead Or Managerial or Technical 
DROP TABLE IF EXISTS tinterview_types;
CREATE TABLE public.tinterview_types(
	type_id int4 not null NOT NULL GENERATED ALWAYS AS IDENTITY,
	type_name varchar(200) NOT NULL,
	type_description varchar(200) NOT NULL,
	type_responsible varchar(100) NOT NULl,
	created_by int4 NOT NULL,
	created_date timestamptz NOT NULL,
	modified_by int4 NULL,
	modified_date timestamptz NULL,
	CONSTRAINT pk_tinterview_types PRIMARY KEY (type_id);
	);

-- Interview status, Not Interviewed,Selected, On Hold, Rejected etc.
DROP TABLE IF EXISTS tinterview_statuses;
CREATE TABLE public.tinterview_statuses(
	status_id int4 not null NOT NULL GENERATED ALWAYS AS IDENTITY,
	status_name varchar(200) NOT NULL,
	status_description varchar(200) NOT NULL,
	CONSTRAINT pk_tinterview_statuses PRIMARY KEY (status_id);
	);



