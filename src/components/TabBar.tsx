import React, { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiCube, BiUserPin, BiHomeAlt, BiMoneyWithdraw, BiCartDownload } from 'react-icons/bi';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';

// Styles
import '../styles/TabBar.css';

interface Props {
    tabOption: 'inventory' | 'clients' | 'home' | 'transactions' | 'invoice' | 'admin'
}

function TabBar({ tabOption }: Props) {    
    const { setIsLoading } = useAppStates();
    const { user } = useAuth();

    const animationMove = useCallback((ul: HTMLUListElement, li: HTMLLIElement) => {
        if (!ul.classList.contains('move') && !li.classList.contains('active')) {
            setIsLoading(true);
            Array.from(ul.children).forEach( child => {
                child.classList.remove('active');
            });
            
            ul.style.setProperty('--x-n', li.offsetLeft + li.offsetWidth / 2 + 'px');
            li.classList.add('move');
            ul.classList.add('move');

            setTimeout(() => {
                li.classList.add('active');
                setTimeout(() => {
                    ul.classList.remove('move');
                    li.classList.remove('move');
                    ul.style.setProperty('--x', li.offsetLeft + li.offsetWidth / 2 + 'px');
                }, 300);
            }, 900);
        }
    }, [setIsLoading]);

    useEffect(() => {
        const opt = document.querySelector(`.tab_${tabOption}`) as HTMLAnchorElement;
        let li = opt.parentElement as HTMLLIElement;
        let ul = li.parentElement as HTMLUListElement;
        animationMove(ul, li);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabOption]);

    const handleClickOpt: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        let li = e.currentTarget.parentElement as HTMLLIElement;
        let ul = li.parentElement as HTMLUListElement;
        animationMove(ul, li);
    };

    return(
        <div className='tabBar_container'>
            <ul className='tabBar'>
                <li>
                    <Link to='/home/inventory' onClick={handleClickOpt} className='tab_inventory'>
                        <div>
                            <BiCube />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/home/clients' onClick={handleClickOpt} className='tab_clients'>
                        <div>
                            <BiUserPin />
                        </div>
                    </Link>
                </li>
                <li className='active'>
                    <Link to={user?.roleId.toUpperCase() !== 'D1141F51-D57B-4376-915D-9D45DC29078C' ? '/home' : '/home/admin'} onClick={handleClickOpt} className='tab_home tab_admin'>
                        <div>
                            <BiHomeAlt />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/home/transactions' onClick={handleClickOpt} className='tab_transactions'>
                        <div>
                            <BiMoneyWithdraw />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to='/home/invoice' onClick={handleClickOpt} className='tab_invoice'>
                        <div>
                            <BiCartDownload />
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export { TabBar };