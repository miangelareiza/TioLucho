import React from 'react';

// Styles
import '../styles/PageContent.css';

interface Prop {
    children: React.ReactNode
}

function PageContent({children}: Prop) {
    return (           
        <main className='page_content'>
            {children}
        </main>
    );
}

export { PageContent };