import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div class="text-center">
            <img
                src="../../public/images/404.svg"
                alt="Страница не найдена"
                class="img-fluid h-25"
            />
            <h1 class="h4 text-muted">Страница не найдена</h1>
            <p>
                "Но вы можете перейти "
                <Link to="/">на главную страницу</Link>
            </p>
        </div>
    );
} 

export { NotFoundPage };