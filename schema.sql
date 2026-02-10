CREATE DATABASE teamtaskmanager;



BEGIN;
CREATE TABLE IF NOT EXISTS public.users
(
    id serial NOT NULL,
    first_name text COLLATE pg_catalog."default" NOT NULL,
    last_name text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);
CREATE TABLE IF NOT EXISTS public.teams
(
    id serial NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now(),
    team_member integer[],
    CONSTRAINT teams_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.team_members
(
    user_id integer NOT NULL,
    team_id integer NOT NULL,
    CONSTRAINT team_members_pkey PRIMARY KEY (user_id, team_id)
);
CREATE TABLE IF NOT EXISTS public.tasks
(
    id serial NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    team_id integer,
    assigned_to integer,
    created_by integer,
    completed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT tasks_pkey PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.teams
    ADD CONSTRAINT teams_owner_id_fkey FOREIGN KEY (owner_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
ALTER TABLE IF EXISTS public.team_members
    ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id)
    REFERENCES public.teams (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
ALTER TABLE IF EXISTS public.team_members
    ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
ALTER TABLE IF EXISTS public.tasks
    ADD CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY (assigned_to)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
ALTER TABLE IF EXISTS public.tasks
    ADD CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
ALTER TABLE IF EXISTS public.tasks
    ADD CONSTRAINT tasks_team_id_fkey FOREIGN KEY (team_id)
    REFERENCES public.teams (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
END;