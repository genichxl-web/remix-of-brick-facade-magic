CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: ai_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: fill_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fill_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    image_url text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: gallery_photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery_photos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    section_key text NOT NULL,
    image_url text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: pillar_colors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pillar_colors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    image_url text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: portfolio_photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portfolio_photos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    image_url text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: portfolio_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portfolio_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    image_url text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    location text
);


--
-- Name: section_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.section_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    section_key text NOT NULL,
    text text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: section_texts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.section_texts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    section_key text NOT NULL,
    title text,
    subtitle text,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ai_settings ai_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_settings
    ADD CONSTRAINT ai_settings_key_key UNIQUE (key);


--
-- Name: ai_settings ai_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_settings
    ADD CONSTRAINT ai_settings_pkey PRIMARY KEY (id);


--
-- Name: fill_types fill_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fill_types
    ADD CONSTRAINT fill_types_pkey PRIMARY KEY (id);


--
-- Name: gallery_photos gallery_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_photos
    ADD CONSTRAINT gallery_photos_pkey PRIMARY KEY (id);


--
-- Name: pillar_colors pillar_colors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pillar_colors
    ADD CONSTRAINT pillar_colors_pkey PRIMARY KEY (id);


--
-- Name: portfolio_photos portfolio_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_photos
    ADD CONSTRAINT portfolio_photos_pkey PRIMARY KEY (id);


--
-- Name: portfolio_projects portfolio_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_projects
    ADD CONSTRAINT portfolio_projects_pkey PRIMARY KEY (id);


--
-- Name: section_items section_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_items
    ADD CONSTRAINT section_items_pkey PRIMARY KEY (id);


--
-- Name: section_texts section_texts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_texts
    ADD CONSTRAINT section_texts_pkey PRIMARY KEY (id);


--
-- Name: section_texts section_texts_section_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_texts
    ADD CONSTRAINT section_texts_section_key_key UNIQUE (section_key);


--
-- Name: portfolio_projects update_portfolio_projects_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_portfolio_projects_updated_at BEFORE UPDATE ON public.portfolio_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: section_items update_section_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_section_items_updated_at BEFORE UPDATE ON public.section_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: section_texts update_section_texts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_section_texts_updated_at BEFORE UPDATE ON public.section_texts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: portfolio_photos portfolio_photos_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_photos
    ADD CONSTRAINT portfolio_photos_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.portfolio_projects(id) ON DELETE CASCADE;


--
-- Name: fill_types Anyone can delete fill types; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete fill types" ON public.fill_types FOR DELETE USING (true);


--
-- Name: gallery_photos Anyone can delete gallery photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete gallery photos" ON public.gallery_photos FOR DELETE USING (true);


--
-- Name: pillar_colors Anyone can delete pillar colors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete pillar colors" ON public.pillar_colors FOR DELETE USING (true);


--
-- Name: portfolio_photos Anyone can delete portfolio photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete portfolio photos" ON public.portfolio_photos FOR DELETE USING (true);


--
-- Name: portfolio_projects Anyone can delete portfolio projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete portfolio projects" ON public.portfolio_projects FOR DELETE USING (true);


--
-- Name: section_items Anyone can delete section items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete section items" ON public.section_items FOR DELETE USING (true);


--
-- Name: ai_settings Anyone can insert ai settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert ai settings" ON public.ai_settings FOR INSERT WITH CHECK (true);


--
-- Name: fill_types Anyone can insert fill types; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert fill types" ON public.fill_types FOR INSERT WITH CHECK (true);


--
-- Name: gallery_photos Anyone can insert gallery photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert gallery photos" ON public.gallery_photos FOR INSERT WITH CHECK (true);


--
-- Name: pillar_colors Anyone can insert pillar colors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert pillar colors" ON public.pillar_colors FOR INSERT WITH CHECK (true);


--
-- Name: portfolio_photos Anyone can insert portfolio photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert portfolio photos" ON public.portfolio_photos FOR INSERT WITH CHECK (true);


--
-- Name: portfolio_projects Anyone can insert portfolio projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert portfolio projects" ON public.portfolio_projects FOR INSERT WITH CHECK (true);


--
-- Name: section_items Anyone can insert section items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert section items" ON public.section_items FOR INSERT WITH CHECK (true);


--
-- Name: section_texts Anyone can insert section texts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert section texts" ON public.section_texts FOR INSERT WITH CHECK (true);


--
-- Name: ai_settings Anyone can update ai settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update ai settings" ON public.ai_settings FOR UPDATE USING (true);


--
-- Name: fill_types Anyone can update fill types; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update fill types" ON public.fill_types FOR UPDATE USING (true);


--
-- Name: gallery_photos Anyone can update gallery photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update gallery photos" ON public.gallery_photos FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: pillar_colors Anyone can update pillar colors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update pillar colors" ON public.pillar_colors FOR UPDATE USING (true);


--
-- Name: portfolio_photos Anyone can update portfolio photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update portfolio photos" ON public.portfolio_photos FOR UPDATE USING (true);


--
-- Name: portfolio_projects Anyone can update portfolio projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update portfolio projects" ON public.portfolio_projects FOR UPDATE USING (true);


--
-- Name: section_items Anyone can update section items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update section items" ON public.section_items FOR UPDATE USING (true);


--
-- Name: section_texts Anyone can update section texts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update section texts" ON public.section_texts FOR UPDATE USING (true);


--
-- Name: ai_settings Anyone can view ai settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view ai settings" ON public.ai_settings FOR SELECT USING (true);


--
-- Name: fill_types Anyone can view fill types; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view fill types" ON public.fill_types FOR SELECT USING (true);


--
-- Name: gallery_photos Anyone can view gallery photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view gallery photos" ON public.gallery_photos FOR SELECT USING (true);


--
-- Name: pillar_colors Anyone can view pillar colors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view pillar colors" ON public.pillar_colors FOR SELECT USING (true);


--
-- Name: portfolio_photos Anyone can view portfolio photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view portfolio photos" ON public.portfolio_photos FOR SELECT USING (true);


--
-- Name: portfolio_projects Anyone can view portfolio projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view portfolio projects" ON public.portfolio_projects FOR SELECT USING (true);


--
-- Name: section_items Anyone can view section items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view section items" ON public.section_items FOR SELECT USING (true);


--
-- Name: section_texts Anyone can view section texts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view section texts" ON public.section_texts FOR SELECT USING (true);


--
-- Name: ai_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: fill_types; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fill_types ENABLE ROW LEVEL SECURITY;

--
-- Name: gallery_photos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

--
-- Name: pillar_colors; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pillar_colors ENABLE ROW LEVEL SECURITY;

--
-- Name: portfolio_photos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.portfolio_photos ENABLE ROW LEVEL SECURITY;

--
-- Name: portfolio_projects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

--
-- Name: section_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.section_items ENABLE ROW LEVEL SECURITY;

--
-- Name: section_texts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.section_texts ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


