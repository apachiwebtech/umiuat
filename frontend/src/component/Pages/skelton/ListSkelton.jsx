import React from 'react';

const ListSkeleton = () => {
    // Create an array to represent the number of skeleton items
    const skeletonItems = Array(6).fill(0); // Change 5 to the number of skeleton items you want

    return (
        <div>
            <main>
                <ul className="o-vertical-spacing o-vertical-spacing--l">
                    {skeletonItems.map((_, index) => (
                        <li key={index} className="blog-post o-media row">
                            <div className="o-media__figure col-4">
                                <span className="skeleton-box" style={{ width: "100px", height: "80px" }}></span>
                            </div>
                            <div className="o-media__body col-8">
                                <div className="o-vertical-spacing">
                                    <p>
                                        <span className="skeleton-box" style={{ width: "80%" }}></span>
                                        <span className="skeleton-box" style={{ width: "90%" }}></span>
                                        <span className="skeleton-box" style={{ width: "83%" }}></span>
                                        <span className="skeleton-box" style={{ width: "80%" }}></span>
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default ListSkeleton;
