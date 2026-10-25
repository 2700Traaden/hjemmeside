// Liste over memes over tid. Nyeste NEDERST i listen.
// Det seneste bliver automatisk vist som "Dagens meme", resten i arkivet.
// "url" = Instagram-opslag (vises som indlejret Instagram-post).
// "images" = selvstændigt billede/billedserie uploadet direkte (vises som billede(r)).
const MEMES = [
  { url: "https://www.instagram.com/reel/DdVpI5Jtz1k/", date: "17. august 2026" },
  { url: "https://www.instagram.com/reel/Dc2gY7NsrZt/", date: "24. august 2026" },
  { url: "https://www.instagram.com/p/DcxYB4HjKis/", date: "31. august 2026" },
  { url: "https://www.instagram.com/reel/Dc-Vtrdtel1/", date: "7. september 2026" },
  { images: [
      "assets/meme-minerva-1.webp",
      "assets/meme-minerva-2.webp",
      "assets/meme-minerva-4.webp",
      "assets/meme-minerva-3.webp"
    ], date: "18. september 2026", alt: "Kender du (løbe)typen? 2700 Minerva-model" },
  { url: "https://www.instagram.com/reel/Db7UPiSMEn3/", date: "25. september 2026" },
  { images: [
      "assets/meme-kampdag-0.jpg",
      "assets/meme-kampdag-1.jpg",
      "assets/meme-kampdag-2.jpg",
      "assets/meme-kampdag-3.jpg"
    ], date: "3. oktober 2026", alt: "Tidens Tern: Københavnerbrag – historisk arbejderopgør og lidt class-fishing" },
  { url: "https://www.instagram.com/p/DebuCNAN4aE/", date: "25. oktober 2026" },
  { url: "https://www.instagram.com/p/DeeEyjlNw3o/", date: "25. oktober 2026" },
  { url: "https://www.instagram.com/p/DeoGKvGoqqi/", date: "25. oktober 2026" }
];
