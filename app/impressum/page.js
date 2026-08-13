export const dynamic = "force-dynamic";

export default function Impressum() {
  return (
    <div style={{ background: "#EEF1EA", color: "#1C2B27", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-md mx-auto px-5 py-10">
        <h1 className="text-xl font-bold mb-6">Impressum</h1>

        <p className="text-sm font-semibold mb-1">Haftung für Inhalte</p>
        <p className="text-sm leading-relaxed mb-4">
          Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch
          keine Gewähr übernehmen. Die auf Einkaufsradar angezeigten Preise sind
          eigene, händisch durchgeführte Stichproben-Erhebungen auf Basis öffentlich
          zugänglicher Quellen (Prospekte, Online-Shops der Handelsketten) und können
          je nach Filiale, Stadt oder Kommune sowie zeitlichem Erhebungspunkt von den
          tatsächlichen Preisen abweichen. Nähere Angaben zur Erhebungsmethodik
          finden sich im Bereich "Bewertung" innerhalb der Anwendung.
        </p>

        <p className="text-sm font-semibold mb-1">Haftung für Links</p>
        <p className="text-sm leading-relaxed mb-4">
          Unser Angebot enthält gegebenenfalls Links zu externen Websites Dritter,
          auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich.
        </p>

        <p className="text-sm font-semibold mb-1">Urheberrecht</p>
        <p className="text-sm leading-relaxed mb-4">
          Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser
          Website unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als
          solche gekennzeichnet.
        </p>

        <p className="text-sm font-semibold mb-1">Verfügbarkeit</p>
        <p className="text-sm leading-relaxed mb-4">
          Es besteht kein Anspruch auf ständige Verfügbarkeit der Website.
        </p>

        <p className="text-sm font-semibold mb-1">Kontakt</p>
        <p className="text-sm leading-relaxed mb-4">
          E-Mail: einkaufsradar@gmail.com
        </p>

        <p className="text-sm font-semibold mb-1">Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</p>
        <p className="text-sm leading-relaxed mb-4">
          Yannis Peer<br />
          [Anschrift wird ergänzt]<br />
          Deutschland
        </p>

        <p className="text-sm font-semibold mb-1">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</p>
        <p className="text-sm leading-relaxed mb-6">
          Yannis Peer<br />
          [Anschrift wird ergänzt]
        </p>

        <a href="/" className="text-sm underline" style={{ color: "#2F6F4E" }}>
          &larr; Zurück zu Einkaufsradar
        </a>
      </div>
    </div>
  );
}