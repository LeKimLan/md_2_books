import React from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Category() {
    let { categoryName } = useParams();
    const { productStore, categoryStore} = useSelector(store => store)
    console.log('categoryStore', categoryStore.data)

    return (
        <div>
            { categoryName }
            {/* {
                categoryStore?.data?.map((item) => {
                    if (item.categories == categoryName) {
                        return (
                            <div>
                                {item.name}
                            </div>
                        )
                    }
                })
            } */}
        </div>
    )
}
