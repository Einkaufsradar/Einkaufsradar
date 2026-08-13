export const dynamic = "force-dynamic";

export default function Datenschutz() {
  return (
    <div style={{ background: "#EEF1EA", color: "#1C2B27", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-md mx-auto px-5 py-10">
        <h1 className="text-xl font-bold mb-6">Datenschutzerklärung</h1>

        <p className="text-sm font-semibold mb-1">1. Datenspeicherung im Browser (Local Storage)</p>
        <p className="text-sm leading-relaxed mb-4">
          Einkaufsradar speichert bestimmte Einstellungen direkt in deinem Browser
          (sogenannter "Local Storage"), um dir die Bedienung zu erleichtern. Dazu
          zählen dein zuletzt ausgewähltes Bundesland, deine bevorzugte Darstellung
          (Hell- oder Dunkelmodus) sowie deine Push-Benachrichtigungs-Präferenz.
          Diese Daten verlassen deinen Browser nicht, werden nicht an uns oder
          Dritte übertragen und lassen sich jederzeit über die
          Browser-Einstellungen löschen.
        </p>

        <p className="text-sm font-semibold mb-1">2. Datenbank (Supabase)</p>
        <p className="text-sm leading-relaxed mb-4">
          Die angezeigten Preisdaten werden über den Dienst Supabase bereitgestellt
          und abgerufen. Dabei werden ausschließlich die von uns recherchierten,
          allgemeinen Preisinformationen (Bundesland, Kalenderwoche, Handelskette,
          Preis) gespeichert. Es werden keine personenbezogenen Daten von
          Besucherinnen und Besuchern der Website in dieser Datenbank abgelegt.
        </p>

        <p className="text-sm font-semibold mb-1">3. Server-Hosting</p>
        <p className="text-sm leading-relaxed mb-4">
          Diese Website wird über einen externen Hosting-Anbieter bereitgestellt.
          Beim Aufruf der Seite werden durch den Hosting-Anbieter technisch
          bedingt sogenannte Server-Logfiles verarbeitet (z. B. IP-Adresse,
          Datum und Uhrzeit des Zugriffs, aufgerufene Seite), wie dies bei nahezu
          jedem Website-Aufruf im Internet der Fall ist. Diese Daten dienen
          ausschließlich der technischen Bereitstellung und Sicherheit der Seite
          und werden von uns nicht ausgewertet.
        </p>

        <p className="text-sm font-semibold mb-1">4. Keine Analyse-Tools, keine Werbung</p>
        <p className="text-sm leading-relaxed mb-4">
          Einkaufsradar verwendet aktuell keine Analyse- oder Tracking-Tools und
          zeigt keine Werbung an. Es werden keine Cookies zu Marketing- oder
          Analysezwecken gesetzt.
        </p>

        <p className="text-sm font-semibold mb-1">5. Deine Rechte</p>
        <p className="text-sm leading-relaxed mb-4">
          Da im Rahmen der Nutzung von Einkaufsradar keine personenbezogenen
          Daten von dir bei uns gespeichert werden, bestehen aktuell keine
          entsprechenden Auskunfts-, Berichtigungs- oder Löschungsansprüche
          gegenüber uns. Solltest du dennoch Fragen zum Datenschutz haben,
          kannst du uns jederzeit unter einkaufsradar@gmail.com erreichen.
        </p>

        <p className="text-sm font-semibold mb-1">6. Verantwortlicher</p>
        <p className="text-sm leading-relaxed mb-4">
          Yannis Peer<br />
          [Anschrift wird ergänzt]<br />
          E-Mail: einkaufsradar@gmail.com
        </p>

        <p className="text-xs mt-8" style={{ color: "#5B6B65" }}>
          Stand: August 2026
        </p>

        <a href="/" className="text-sm underline block mt-4" style={{ color: "#2F6F4E" }}>
          &larr; Zurück zu Einkaufsradar
        </a>
      </div>
    </div>
  );
}