import {
  PHARMACY_CATALOG,
  type PharmacyMedicine,
} from "@/data/pharmacy_catalog";

export function searchMedicines(query: string): readonly PharmacyMedicine[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return PHARMACY_CATALOG.filter(
    (medicine) =>
      medicine.brandName.toLocaleLowerCase().includes(normalizedQuery) ||
      medicine.genericName.toLocaleLowerCase().includes(normalizedQuery),
  );
}

export function getMedicineById(
  id: string,
): PharmacyMedicine | undefined {
  return PHARMACY_CATALOG.find((medicine) => medicine.id === id);
}

export function generateWhatsAppInquiryUrl(
  phone: string,
  medicineName: string,
): string {
  const normalizedPhone = phone.replace(/\D/g, "");
  const message = `Inquiry:\n\nMedicine: ${medicineName}\n\nRequesting price and availability.`;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
