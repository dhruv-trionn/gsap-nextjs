import RevelTextOnScroll from '@/components/RevelTextOnScroll'
import React from 'react'

const Page = () => {
    return (
        <div >
            <div className='min-h-[200vh]'>
                <RevelTextOnScroll
                    text="Animate This Text With Line Masks"
                    className='text-[50px] mt-80'
                    as={'p'}
                    animation={
                        {
                            markers: true,
                            scrub: false,
                            startPosition: 'top 10%',
                            endPosition: 'bottom top'
                        }
                    }
                />
            </div>

            <div className='min-h-[200vh]' >
                <RevelTextOnScroll
                    html="<span style='color:red'>Dynamic HTML</span> inside Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis commodi at esse, dolor temporibus neque aut, dolorem explicabo magnam quam praesentium ex, vitae error laudantium aspernatur voluptas ea amet iste?"
                    as="p"
                    className="text-6xl font-light text-gray-700"
                    animation={{
                        markers: true,
                        startPosition: 'top center',
                        endPosition: 'bottom center'
                    }}
                />
            </div>

            <div className='min-h-[200vh]'>
                <RevelTextOnScroll
                    text="Custom Animation Example"
                    animation={{
                        yPercent: 120,
                        stagger: { amount: 0.2, from: "random" },
                        scrub: false,
                        markers: true,
                        ease: "back.out(1.7)",
                    }}
                />

            </div>
        </div>
    )
}

export default Page