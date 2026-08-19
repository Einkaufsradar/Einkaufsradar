export const dynamic = "force-dynamic";

export default function Datenschutz() {
  return (
    <div style={{ background: "#EEF1EA", color: "#1C2B27", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-md mx-auto px-5 py-10">
        <h1 className="text-xl font-bold mb-6">Datenschutzerklärung</h1>

        <p className="text-sm leading-relaxed mb-4">
          Der Schutz deiner Daten ist uns wichtig. Im Folgenden erläutern wir
          ausführlich, welche Daten bei der Nutzung von Einkaufsradar in
          welchem Umfang verarbeitet werden und aus welchem Grund dies
          geschieht.
        </p>

        <p className="text-sm font-semibold mb-1">1. Datenspeicherung im Browser (Local Storage)</p>
        <p className="text-sm leading-relaxed mb-4">
          Einkaufsradar speichert bestimmte Einstellungen direkt und
          ausschließlich in deinem eigenen Browser, in dem sogenannten "Local
          Storage", um dir die wiederholte Bedienung der Anwendung so
          angenehm und komfortabel wie möglich zu gestalten. Zu diesen
          gespeicherten Einstellungen zählen dein zuletzt ausgewähltes
          Bundesland, deine bevorzugte Darstellung in Form des Hell- oder
          Dunkelmodus sowie deine persönliche Push-Benachrichtigungs-Präferenz.
          Diese Daten verlassen deinen Browser zu keinem Zeitpunkt, werden
          weder an uns noch an Dritte übertragen und lassen sich von dir
          jederzeit selbstständig über die Einstellungen deines Browsers
          vollständig löschen.
        </p>

        <p className="text-sm font-semibold mb-1">2. Datenbank (Supabase)</p>
        <p className="text-sm leading-relaxed mb-4">
          Die innerhalb der Anwendung angezeigten Preisdaten werden über den
          externen Dienst Supabase bereitgestellt und von dort abgerufen.
          Dabei werden ausschließlich die von uns selbst recherchierten,
          rein allgemeinen Preisinformationen gespeichert, konkret Angaben zu
          Bundesland, Kalenderwoche, Handelskette und dem jeweiligen Preis.
          Es werden im Rahmen dieser Datenbank zu keinem Zeitpunkt
          personenbezogene Daten von Besucherinnen und Besuchern der Website
          erhoben oder abgelegt.
        </p>

        <p className="text-sm font-semibold mb-1">3. Server-Hosting (Vercel)</p>
        <p className="text-sm leading-relaxed mb-4">
          Diese Website und die zugehörige Anwendung werden über den externen
          Hosting-Anbieter Vercel bereitgestellt. Beim Aufruf der Seite
          werden durch den Hosting-Anbieter technisch bedingt sogenannte
          Server-Logfiles verarbeitet, darunter beispielsweise die
          IP-Adresse des zugreifenden Geräts, Datum und Uhrzeit des Zugriffs
          sowie die konkret aufgerufene Seite. Diese Verarbeitung findet bei
          nahezu jedem Website-Aufruf im Internet in vergleichbarer Form statt
          und dient bei uns ausschließlich der technischen Bereitstellung
          und der Absicherung der Seite gegen Missbrauch. Eine gezielte
          Auswertung dieser Daten durch uns findet nicht statt.
        </p>

        <p className="text-sm font-semibold mb-1">4. Keine Analyse-Tools, keine Werbung</p>
        <p className="text-sm leading-relaxed mb-4">
          Einkaufsradar verwendet zum jetzigen Zeitpunkt bewusst keinerlei
          Analyse- oder Tracking-Tools und zeigt auch keinerlei Werbung an.
          Es werden dementsprechend auch keine Cookies zu Marketing- oder
          Analysezwecken gesetzt, und dein Nutzungsverhalten wird von uns
          nicht ausgewertet oder nachverfolgt.
        </p>

        <p className="text-sm font-semibold mb-1">5. Deine Rechte</p>
        <p className="text-sm leading-relaxed mb-4">
          Da im Rahmen der Nutzung von Einkaufsradar, wie oben beschrieben,
          keine personenbezogenen Daten von dir bei uns dauerhaft gespeichert
          werden, bestehen aktuell keine entsprechenden Auskunfts-,
          Berichtigungs- oder Löschungsansprüche im herkömmlichen Sinne
          gegenüber uns. Solltest du dennoch Fragen oder Anliegen zum
          Datenschutz haben, kannst du uns selbstverständlich jederzeit unter
          der folgenden Adresse erreichen: einkaufsradar@gmail.com
        </p>

        <p className="text-sm font-semibold mb-1">6. Verantwortlicher</p>
        <p className="text-sm leading-relaxed mb-4">
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung für die
          hier beschriebene Datenverarbeitung ist:<br />
          Yannis Peer<br />
          August-Bebel-Straße 6<br />
          33602 Bielefeld<br />
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