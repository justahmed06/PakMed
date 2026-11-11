export interface PharmacyMedicine {
  readonly id: string;
  readonly brandName: string;
  readonly genericName: string;
  readonly dosageForm: string;
  readonly strength: string;
  readonly primaryIndication: string;
  readonly prescriptionRequired: boolean;
  readonly approximatePricePKR: number;
}

export const PHARMACY_CATALOG: readonly PharmacyMedicine[] = [
  {
    id: "panadol",
    brandName: "Panadol",
    genericName: "Paracetamol",
    dosageForm: "Tablet",
    strength: "500 mg",
    primaryIndication: "Pain and fever relief",
    prescriptionRequired: false,
    approximatePricePKR: 45,
  },
  {
    id: "augmentin",
    brandName: "Augmentin",
    genericName: "Amoxicillin / Clavulanic acid",
    dosageForm: "Tablet",
    strength: "625 mg",
    primaryIndication: "Bacterial infections",
    prescriptionRequired: true,
    approximatePricePKR: 320,
  },
  {
    id: "brufen",
    brandName: "Brufen",
    genericName: "Ibuprofen",
    dosageForm: "Tablet",
    strength: "400 mg",
    primaryIndication: "Pain and inflammation",
    prescriptionRequired: false,
    approximatePricePKR: 90,
  },
  {
    id: "risek",
    brandName: "Risek",
    genericName: "Omeprazole",
    dosageForm: "Capsule",
    strength: "20 mg",
    primaryIndication: "Acid reflux and ulcers",
    prescriptionRequired: false,
    approximatePricePKR: 180,
  },
  {
    id: "softin",
    brandName: "Softin",
    genericName: "Loratadine",
    dosageForm: "Tablet",
    strength: "10 mg",
    primaryIndication: "Allergy symptoms",
    prescriptionRequired: false,
    approximatePricePKR: 95,
  },
  {
    id: "flagyl",
    brandName: "Flagyl",
    genericName: "Metronidazole",
    dosageForm: "Tablet",
    strength: "400 mg",
    primaryIndication: "Certain bacterial and parasitic infections",
    prescriptionRequired: true,
    approximatePricePKR: 70,
  },
  {
    id: "disprin",
    brandName: "Disprin",
    genericName: "Aspirin",
    dosageForm: "Dispersible tablet",
    strength: "300 mg",
    primaryIndication: "Pain and fever relief",
    prescriptionRequired: false,
    approximatePricePKR: 35,
  },
  {
    id: "flytrin",
    brandName: "Flytrin",
    genericName: "Permethrin",
    dosageForm: "Lotion",
    strength: "5%",
    primaryIndication: "Scabies and lice",
    prescriptionRequired: false,
    approximatePricePKR: 140,
  },
  {
    id: "calpol",
    brandName: "Calpol",
    genericName: "Paracetamol",
    dosageForm: "Oral suspension",
    strength: "120 mg/5 mL",
    primaryIndication: "Pain and fever relief",
    prescriptionRequired: false,
    approximatePricePKR: 160,
  },
  {
    id: "entamizole",
    brandName: "Entamizole",
    genericName: "Diloxanide / Metronidazole",
    dosageForm: "Tablet",
    strength: "250 mg / 200 mg",
    primaryIndication: "Amoebic and intestinal infections",
    prescriptionRequired: true,
    approximatePricePKR: 85,
  },
];
