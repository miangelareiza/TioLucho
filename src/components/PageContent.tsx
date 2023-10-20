import React from 'react';

// Styles
import '../styles/PageContent.css';

interface Props {
    children: React.ReactNode
}

function PageContent({children}: Props) {
    return (           
        <main className='page_content'>
            {children}
        </main>
    );
}

export { PageContent };