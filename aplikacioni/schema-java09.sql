-- Ekzekuto pas schema.sql dhe schema-java05.sql, në të njëjtën databazë Neon.
CREATE TABLE IF NOT EXISTS preferimet (
  github_id TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  udhetimi_id TEXT NOT NULL REFERENCES udhetimet(id) ON DELETE CASCADE,
  krijuar_me TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (github_id, udhetimi_id)
);

-- Çelësi i përbërë ndalon kopjet edhe nga kërkesa të njëkohshme.
-- Pa të dhëna personale ose preferime shembull në migrim.
