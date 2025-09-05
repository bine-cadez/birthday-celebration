'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Gift,
  Music,
  Utensils,
  Camera,
  ChevronDown,
  Users,
  Waves,
  PartyPopper,
  Bus,
} from 'lucide-react'

import HotelMap from '@/components/HotelMap'

export const programItems = [
  {
    id: 'friday-checkin',
    day: 'Petek',
    time: '15:00–17:00',
    title: 'Check-in (hotel & dogodek)',
    description:
      '✔️ Check-in na hotelski recepciji\n📍 Check-in na dogodek – v knjižnici 😊',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-slate-600',
  },
  {
    id: 'friday-henry-morgan',
    day: 'Petek',
    time: '18:00–22:00',
    title: '🎤 Henry Morgan',
    description: '📍 3. nadstropje (z dvigalom) – sledite usmeritvam',
    icon: <Music className="h-5 w-5" />,
    color: 'bg-slate-600',
  },
  {
    id: 'friday-transfer-beach',
    day: 'Petek',
    time: '22:00',
    title: '🚶‍♂️🚐 Transferji na hotelsko plažo',
    description: 'Oddaljena 270 m, dostopna tudi peš 😊',
    icon: <Bus className="h-5 w-5" />,
    color: 'bg-slate-600',
  },
  {
    id: 'friday-party',
    day: 'Petek',
    time: '22:30–1:00',
    title: '🎉 Zabava s presenečenjem',
    icon: <PartyPopper className="h-5 w-5" />,
    color: 'bg-slate-600',
  },

  {
    id: 'saturday-breakfast',
    day: 'Sobota',
    time: '8:00–11:00',
    title: '🍽️ Zajtrk',
    description: 'Vila Athena – pod hotelskim bazenom',
    icon: <Utensils className="h-5 w-5" />,
    color: 'bg-slate-600',
  },
  {
    id: 'saturday-beach-lunch',
    day: 'Sobota',
    time: '10:00–17:00',
    title: '🌴 Druženje in kosilo na hotelski plaži (Adults Zone)',
    icon: <Waves className="h-5 w-5" />,
    color: 'bg-slate-600',
  },
  {
    id: 'saturday-transfer-dinner',
    day: 'Sobota',
    time: '19:00',
    title: '🚶‍♀️🚐 Transferji na lokacijo večerje',
    description: 'Oddaljena 550 m, dostopna tudi peš 😊',
    icon: <Bus className="h-5 w-5" />,
    color: 'bg-slate-600',
  },
  {
    id: 'saturday-dinner-party',
    day: 'Sobota',
    time: '19:30–2:00',
    title: '🍽️🎶 Večerja in zabava',
    icon: <Utensils className="h-5 w-5" />,
    color: 'bg-slate-600',
  },

  {
    id: 'sunday-breakfast',
    day: 'Nedelja',
    time: '8:00–11:00',
    title: '🍽️ Zajtrk',
    description: 'Vila Athena – pod hotelskim bazenom',
    icon: <Utensils className="h-5 w-5" />,
    color: 'bg-slate-600',
  },
  {
    id: 'sunday-checkout',
    day: 'Nedelja',
    time: 'Do 12:00',
    title: '🧳 Check-out',
    description: '',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-slate-600',
  },
];

export default function BirthdayProgram() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50 dark:from-slate-900 dark:via-slate-800 dark:to-stone-900'>
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-8 bg-[url(/hero.jpg)] bg-cover bg-center'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-100/20 via-stone-50/10 to-slate-200/20 dark:from-slate-800/20 dark:via-stone-900/10 dark:to-slate-700/20' />

        <div className='relative z-10 w-full max-w-6xl mx-auto'>
          <div className='bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 md:p-8 shadow-2xl border border-slate-200/50 dark:border-slate-700/50'>
            <div className='text-center mb-6 md:mb-8'>
              <h1 className='text-3xl md:text-5xl font-black text-slate-700 dark:text-slate-200 mb-4 tracking-tight'>
                🎉 Dobrodošli na moji 50ki! 🎉
              </h1>
              <div className='text-base md:text-xl text-slate-600 dark:text-slate-300 font-medium space-y-2'>
                <p>Dragi prijatelji! ❤️</p>
                <p>Vesel sem, da boste od petka do nedelje z mano!</p>
                <p>Se vidimo kmalu! 🥳</p>
              </div>
            </div>

            <div className='relative h-64 md:h-96 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-300/30 dark:border-slate-600/30 mb-6'>
              <HotelMap />
              <div className='absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none' />
              <div className='absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-lg pointer-events-none'>
                <p className='text-sm font-semibold text-slate-800 dark:text-slate-200'>
                  📍 Hotel Kempinski Adriatic
                </p>
                <p className='text-sm pl-[15px] text-slate-800 dark:text-slate-200'>
                  Alberi 300A, 52470
                </p>
                <a
                  href='https://maps.app.goo.gl/DU5qjUvzwZBcaw1e6'
                  target='_blank'
                  className='text-xs underline pl-[15px] pointer-events-auto'
                  rel='noreferrer'
                >
                  Odpri v Google Maps
                </a>
              </div>
            </div>

            <div className='text-center'>
              <p className='text-sm text-slate-600 dark:text-slate-400 mb-2'>
                Pomaknite se navzdol za program
              </p>
              <ChevronDown className='h-6 w-6 text-slate-600 dark:text-slate-400 mx-auto animate-bounce' />
            </div>
          </div>
        </div>
      </section>

      <section className='py-8 md:py-16 px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-8 md:mb-12'>
            <h2 className='text-3xl md:text-4xl font-black text-slate-700 dark:text-slate-200 mb-4'>
              🎊 Program Praznovanja 🎊
            </h2>
          </div>

          <Card className='bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-300/20 dark:border-slate-600/20 shadow-xl'>
            <CardHeader className='text-center'>
              <CardTitle className='text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-200'>
                Program
              </CardTitle>
              <CardDescription className='text-sm md:text-base'>
                Vse aktivnosti od petka do nedelje
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {programItems.map((item, index) => (
                  <div
                    key={item.id}
                    className='border border-slate-300/50 dark:border-slate-600/50 bg-white dark:bg-slate-800 shadow-md rounded-lg transition-all duration-300'
                  >
                    <div className='px-4 md:px-6 py-4'>
                      <div className='flex items-start gap-4'>
                        <div
                          className={`p-2 rounded-full text-white ${item.color} flex-shrink-0`}
                        >
                          {item.icon}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mb-1'>
                            {item.day}
                          </div>
                          <div className='font-bold text-sm md:text-lg text-slate-700 dark:text-slate-200 mb-1'>
                            {item.time}
                          </div>
                          <div className='font-semibold text-sm md:text-base text-slate-800 dark:text-slate-100 mb-2'>
                            {item.title}
                          </div>
                          <div className='text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line'>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-8 p-4 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700'>
                <h3 className='text-lg md:text-xl font-bold text-slate-700 dark:text-slate-200 mb-3'>
                  Moja prošnja!
                </h3>
                <div className='text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2'>
                  <p>
                    Ta vikend naj ostane samo naš. Skušajmo ustvariti nepozabne
                    trenutke in lepe spomine.
                  </p>
                  <p>
                    Telefoni naj imajo mini počitnice – brez fotk (OK, mogoče
                    kakšna gasilska ali medsebojno usklajena lahko 😊), brez
                    objav, samo sproščena dobra družba.
                  </p>
                  <p className='font-semibold text-slate-700 dark:text-slate-200'>
                    Hvala vam! ❤️
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <div className='w-full text-center pb-8'>
        <p className='text-sm text-slate-500 dark:text-slate-400'>
          Powered by{' '}
          <a href='https://www.paideia-events.si' target='_blank'>
            Paideia
          </a>
        </p>
      </div>
    </div>
  )
}
