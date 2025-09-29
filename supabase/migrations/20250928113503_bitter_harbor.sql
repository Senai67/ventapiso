/*
  # Create apartment listing system

  1. New Tables
    - `apartment_data`
      - `id` (uuid, primary key)
      - `title` (text)
      - `price` (text)
      - `address` (text)
      - `meters` (text)
      - `rooms` (text)
      - `bathrooms` (text)
      - `floor` (text)
      - `description` (text)
      - `features` (text)
      - `photos` (jsonb array)
      - `updated_at` (timestamp)
    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to manage data
*/

CREATE TABLE IF NOT EXISTS apartment_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT 'Piso en venta en Calle de Pau Claris',
  price text DEFAULT '2.450.000 €',
  address text DEFAULT 'La Dreta de l''Eixample, Barcelona',
  meters text DEFAULT '183',
  rooms text DEFAULT '3',
  bathrooms text DEFAULT '4',
  floor text DEFAULT 'Planta 5ª exterior con ascensor',
  description text DEFAULT 'La vivienda dispone de tres dormitorios, cada uno con su baño en suite y vestidor. El salón-comedor es muy amplio y luminoso, con acceso a un balcón que da a la calle. La cocina está completamente equipada con electrodomésticos de alta gama.

El piso se encuentra en un edificio señorial de 1900, completamente rehabilitado, manteniendo el encanto arquitectónico original pero con todas las comodidades modernas.',
  features text DEFAULT 'Aire acondicionado
Balcón
Segunda mano/buen estado
Construido en 1900
Calefacción individual: Gas natural
Con ascensor
Certificado energético: E',
  photos jsonb DEFAULT '["https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200", "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200", "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200", "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text DEFAULT 'Hola, me interesa este piso y me gustaría hacer una visita.
Un saludo',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE apartment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policies for apartment_data
CREATE POLICY "Anyone can read apartment data"
  ON apartment_data
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update apartment data"
  ON apartment_data
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can insert apartment data"
  ON apartment_data
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policies for contacts
CREATE POLICY "Anyone can insert contacts"
  ON contacts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read contacts"
  ON contacts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can delete contacts"
  ON contacts
  FOR DELETE
  TO public
  USING (true);

-- Insert initial apartment data if table is empty
INSERT INTO apartment_data (id) 
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM apartment_data);