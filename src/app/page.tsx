import Image from 'next/image';

export default function Home() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center">
      <div className="relative z-10 mx-auto max-w-6xl px-8 text-center">
        <div className="mx-auto mb-8 h-20 w-auto">
          <Image
            src="/AAB-logo.svg"
            width={80}
            height={80}
            alt="AAB Logo"
            className="mx-auto h-20 w-auto"
          />
        </div>
        <div className="mb-8">
          <div
            className="mb-8"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.03em',
              fontWeight: 600,
            }}
          >
            Code. Verify. Build Together.
          </div>
        </div>

        <div className="mb-12">
          <p
            className="mx-auto mb-12 max-w-3xl opacity-80"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              lineHeight: '1.7',
            }}
          >
            AAB Engineering DAO — the infrastructure layer where open-source
            reputation, DAO governance, and contribution integrity converge.
          </p>
          <div className="mb-12 flex items-center justify-center">
            <span className="rounded-md border border-gray-200 px-4 py-2 text-gray-400">
              Membership coming soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
