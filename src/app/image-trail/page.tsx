import ImageTrail from '@/components/ImageTrail'
import React from 'react'

const Page = () => {
    return (
        <div style={{ height: '500px', position: 'relative', overflow: 'hidden', background:'black' }}>
            <ImageTrail
                items={[
                    'https://picsum.photos/id/287/300/300',
                    'https://picsum.photos/id/1001/300/300',
                    'https://picsum.photos/id/1025/300/300',
                    'https://picsum.photos/id/1026/300/300',
                    'https://picsum.photos/id/1027/300/300',
                    'https://picsum.photos/id/1028/300/300',
                    'https://picsum.photos/id/1029/300/300',
                    'https://picsum.photos/id/1030/300/300',
                ]}
                variant={1}
            />
        </div>
    )
}

export default Page