-- Ekzekuto pas schema.sql dhe schema-java05.sql. Vetëm udhëtime fiktive për provë.
CREATE TABLE IF NOT EXISTS kerkesat (
  id BIGSERIAL PRIMARY KEY,
  udhetimi_id TEXT NOT NULL REFERENCES udhetimet(id) ON DELETE CASCADE,
  udhetari_id TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  statusi TEXT NOT NULL DEFAULT 'ne_pritje' CHECK (statusi IN ('ne_pritje', 'e_pranuar')),
  krijuar_me TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pranuar_me TIMESTAMPTZ,
  UNIQUE (udhetimi_id, udhetari_id)
);

CREATE OR REPLACE FUNCTION kerko_vend(p_udhetimi TEXT, p_udhetari TEXT)
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  u udhetimet%ROWTYPE;
  gjendja TEXT;
BEGIN
  -- I njëjti rend kyçjesh si pranimi: fillimisht udhëtimi, pastaj kërkesa.
  SELECT * INTO u FROM udhetimet WHERE id = p_udhetimi FOR UPDATE;
  IF NOT FOUND THEN RETURN 'mungon'; END IF;
  IF NOT EXISTS (SELECT 1 FROM profilet WHERE github_id = p_udhetari AND roli = 'udhetar')
     OR u.shofer_id = p_udhetari THEN RETURN 'ndaluar'; END IF;
  IF u.shofer_id IS NULL OR NOT EXISTS
    (SELECT 1 FROM profilet WHERE github_id = u.shofer_id AND roli = 'shofer')
    THEN RETURN 'pa_shofer'; END IF;
  SELECT statusi INTO gjendja FROM kerkesat
    WHERE udhetimi_id = p_udhetimi AND udhetari_id = p_udhetari;
  IF FOUND THEN RETURN gjendja; END IF;
  IF u.vende <= 0 THEN RETURN 'pa_vende'; END IF;
  INSERT INTO kerkesat (udhetimi_id, udhetari_id) VALUES (p_udhetimi, p_udhetari);
  RETURN 'ne_pritje';
END;
$$;

CREATE OR REPLACE FUNCTION prano_kerkesen(p_udhetimi TEXT, p_kerkesa BIGINT, p_shoferi TEXT)
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  u udhetimet%ROWTYPE;
  k kerkesat%ROWTYPE;
BEGIN
  -- Bllokon pranime konkurruese për të njëjtin udhëtim deri në fund të transaksionit.
  SELECT * INTO u FROM udhetimet WHERE id = p_udhetimi FOR UPDATE;
  IF NOT FOUND THEN RETURN 'mungon'; END IF;
  IF u.shofer_id IS DISTINCT FROM p_shoferi OR NOT EXISTS
    (SELECT 1 FROM profilet WHERE github_id = p_shoferi AND roli = 'shofer')
    THEN RETURN 'ndaluar'; END IF;
  SELECT * INTO k FROM kerkesat WHERE id = p_kerkesa AND udhetimi_id = p_udhetimi FOR UPDATE;
  IF NOT FOUND THEN RETURN 'mungon'; END IF;
  IF k.statusi = 'e_pranuar' THEN RETURN 'e_pranuar'; END IF;
  IF u.vende <= 0 THEN RETURN 'pa_vende'; END IF;
  -- Të dy UPDATE-t janë brenda të njëjtit transaksion të funksionit PostgreSQL.
  UPDATE udhetimet SET vende = vende - 1 WHERE id = p_udhetimi;
  UPDATE kerkesat SET statusi = 'e_pranuar', pranuar_me = NOW() WHERE id = p_kerkesa;
  RETURN 'e_pranuar';
END;
$$;
