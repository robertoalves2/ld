import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          {/* Redes Sociais */}
          <div className="social-links">
            <p className="text-gray-700 mb-3">Siga nossas redes sociais:</p>
            <p className="space-x-1">
              
              <span className="text-gray-600"> | </span>
              <Link
                href="https://link.liturgiadiaria.top/youtube-liturgiadadiaria"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors duration-200"
                style={{ color: "#4A126B" }}
              >
                YouTube
              </Link>
              <span className="text-gray-600"> | </span>
              <Link
                href="https://link.liturgiadiaria.top/instagram-liturgiadadiaria"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors duration-200"
                style={{ color: "#4A126B" }}
              >
                Instagram
              </Link>
              <span className="text-gray-600"> | </span>
              <Link
                href="https://link.liturgiadiaria.top/whatsapp-canal-liturgia"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors duration-200"
                style={{ color: "#4A126B" }}
              >
                WhatsApp
              </Link>
              <span className="text-gray-600"> | </span>
              <Link
                href="https://link.liturgiadiaria.top/facebook-liturgiadadiaria"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors duration-200"
                style={{ color: "#4A126B" }}
              >
                Facebook
              </Link>
            </p>
          </div>

          {/* Banner */}
          <div className="banner-container">
            <Link
              href="https://link.liturgiadiaria.top/ofertas-exclusivas-tecinova"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://liturgiadiaria.top/banner-ofertas-exclusivas.webp"
                alt="Confira ofertas exclusivas"
                width={400}
                height={200}
                className="mx-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              />
            </Link>
          </div>

          {/* Copyright */}
          <div className="space-y-2">
            <div className="text-gray-600 text-sm">Fonte: liturgiadashoras.online</div>
            <div className="text-sm">
              <span className="text-gray-600">© 2025 </span>
              <Link
                href="https://liturgiadiaria.top/"
                className="hover:underline transition-colors duration-200"
                style={{ color: "#4A126B" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Liturgia Diária
              </Link>
              <span className="text-gray-600"> - Todos os direitos reservados</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
