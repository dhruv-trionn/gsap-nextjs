import WipeImageCard from '@/components/WipeImageCard'

const Page = () => {
    const items = [
        {
            id: 1,
            title: 'Luxury Presence',
            subtitle: 'Redefining digital presence for high-end real estate.',
            image: 'https://picsum.photos/id/1015/1920/1080',
            list: ['Design', 'Branding', 'Development'],
            year: '2025',
            link: {
                text: 'Explore Project',
                href: '#',
            },
        },
        {
            id: 2,
            title: 'Kuros',
            subtitle: 'Redefining digital presence for high-end real estate.',
            image: 'https://picsum.photos/id/1025/1920/1080',
            list: ['Design', 'Branding', 'Development'],
            year: '2025',
            link: {
                text: 'Explore Project',
                href: '#',
            },
        },
        {
            id: 3,
            title: 'William Jonshan',
            subtitle: 'Redefining digital presence for high-end real estate.',
            image: 'https://picsum.photos/id/1035/1920/1080',
            list: ['Design', 'Branding', 'Development'],
            year: '2025',
            link: {
                text: 'Explore Project',
                href: '#',
            },
        },
    ]
    return (
        <>
            <section className="min-h-screen  flex items-center justify-center">
                Spacer
            </section>
            <div className="min-h-screen mt-12">
                {items.map((item, index) => {
                    const isEven = index % 2 !== 0

                    const data = {
                        ...item,
                        isEven
                    }

                    return (
                        <WipeImageCard key={index} {...data} />
                    )
                })}
            </div>
        </>
    )
}

export default Page
