export function getWhatsAppLink(phone: string, patientName: string, doctorName: string, time: string) {
  // Remove non-numeric chars
  const cleanPhone = phone.replace(/\D/g, '');
  
  const msg = `Olá, ${patientName}! Este é um lembrete da sua consulta com ${doctorName} às ${time}.`;
  
  // Encode message for URL
  const encodedMsg = encodeURIComponent(msg);
  
  // Return the official WhatsApp api link
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}
