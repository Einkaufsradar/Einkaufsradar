export const dynamic = "force-dynamic";

export default function Impressum() {
  return (
    <div style={{ background: "#EEF1EA", color: "#1C2B27", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-md mx-auto px-5 py-10">
        <h1 className="text-xl font-bold mb-6">Impressum</h1>

        <p className="text-sm font-semibold mb-1">Haftung für Inhalte</p>
        <p className="text-sm leading-relaxed mb-4">
          Die Inhalte dieser Website und der zugehörigen Anwendung wurden mit
          größter Sorgfalt und nach bestem Wissen zusammengestellt und werden
          regelmäßig überprüft. Für die Richtigkeit, Vollständigkeit und
          Aktualität sämtlicher dargestellter Inhalte können wir dennoch keine
          Gewähr übernehmen, da eine lückenlose, tagesgenaue Kontrolle bei einem
          sich wöchentlich verändernden Angebot naturgemäß nicht in jedem
          Einzelfall möglich ist. Die auf Einkaufsradar angezeigten Preise
          beruhen auf eigenen, händisch durchgeführten Stichproben-Erhebungen
          auf Basis öffentlich zugänglicher Quellen wie Prospekten und
          Online-Shops der jeweiligen Handelsketten. Sie können daher je nach
          Filiale, Stadt oder Kommune sowie in Abhängigkeit vom zeitlichen
          Erhebungspunkt von den tatsächlich vor Ort verlangten Preisen
          abweichen. Ausführlichere Angaben zur genauen Erhebungsmethodik und
          zur Gewichtung einzelner Bestandteile finden sich im Bereich
          "Bewertung" innerhalb der Anwendung selbst.
        </p>

        <p className="text-sm font-semibold mb-1">Haftung für Links</p>
        <p className="text-sm leading-relaxed mb-4">
          Unser Angebot kann an einzelnen Stellen Links zu externen Websites
          Dritter enthalten, auf deren inhaltliche Gestaltung wir keinerlei
          Einfluss haben und die von unserer Kontrolle vollständig unabhängig
          sind. Aus diesem Grund können wir für die dort bereitgestellten,
          fremden Inhalte auch keine Gewähr übernehmen und keine Verantwortung
          tragen. Für die Inhalte der jeweils verlinkten Seiten ist stets
          ausschließlich der jeweilige Anbieter oder Betreiber dieser Seiten
          selbst verantwortlich. Sollten uns dennoch konkrete Anhaltspunkte für
          eine Rechtsverletzung durch einen verlinkten Inhalt bekannt werden,
          werden wir den betreffenden Link umgehend entfernen.
        </p>

        <p className="text-sm font-semibold mb-1">Urheberrecht</p>
        <p className="text-sm leading-relaxed mb-4">
          Die durch den Seitenbetreiber selbst erstellten Inhalte, Texte und
          gestalterischen Elemente auf dieser Website und innerhalb der
          Anwendung unterliegen dem deutschen Urheberrecht. Beiträge Dritter
          sind, soweit vorhanden, als solche gesondert gekennzeichnet. Die
          Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
          Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der
          vorherigen schriftlichen Zustimmung des jeweiligen Autors bzw.
          Erstellers.
        </p>

        <p className="text-sm font-semibold mb-1">Streitschlichtung</p>
        <p className="text-sm leading-relaxed mb-4">
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit, die unter
          https://ec.europa.eu/consumers/odr erreichbar ist. Wir sind weder
          verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <p className="text-sm font-semibold mb-1">Verfügbarkeit</p>
        <p className="text-sm leading-relaxed mb-4">
          Wir sind stets bemüht, die Website und die Anwendung so zuverlässig
          wie möglich verfügbar zu halten. Es besteht jedoch kein
          Rechtsanspruch auf eine ununterbrochene, ständige Verfügbarkeit,
          insbesondere nicht während technischer Wartungsarbeiten oder bei
          Störungen, die außerhalb unseres Einflussbereichs liegen.
        </p>

        <p className="text-sm font-semibold mb-1">Kontakt</p>
        <p className="text-sm leading-relaxed mb-4">
          Bei Fragen, Anmerkungen oder Hinweisen zu den auf Einkaufsradar
          dargestellten Inhalten erreichst du uns jederzeit unter folgender
          E-Mail-Adresse:<br />
          einkaufsradar@gmail.com
        </p>

        <p className="text-sm font-semibold mb-1">Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</p>
        <p className="text-sm leading-relaxed mb-4">
          Yannis Peer<br />
          August-Bebel-Straße 6<br />
          33602 Bielefeld<br />
          Deutschland
        </p>

        <p className="text-sm font-semibold mb-1">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</p>
        <p className="text-sm leading-relaxed mb-6">
          Yannis Peer<br />
          August-Bebel-Straße 6<br />
          33602 Bielefeld
        </p>

        <a href="/" className="text-sm underline" style={{ color: "#2F6F4E" }}>
          &larr; Zurück zu Einkaufsradar
        </a>
      </div>
    </div>
  );
}