import fs from 'fs/promises';

type CountryFields = {
  name: { common: string };
  cca2: string;
  callingCodes: string[];
};

export type Country = {
  name: string;
  code: string;
  dialCode: string;
};

async function countriesAssetGenerator(pathToFile: string) {
  const file = await fs.readFile(pathToFile, 'utf-8');
  const json = JSON.parse(file) as [];
  const countries: Country[] = json
    .map((country: CountryFields) => ({
      name: country.name.common,
      code: country.cca2.toLowerCase(),
      dialCode: country.callingCodes[0]
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Path to the directory and file
  const dirPath = 'src/assets/data';
  const filePath = `${dirPath}/countries.json`;
  // Create the directory if it doesn't exist
  await fs.mkdir(dirPath, { recursive: true });
  // Write the file
  await fs.writeFile(filePath, JSON.stringify(countries, null, 2));
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
void countriesAssetGenerator(process.argv[2]);
