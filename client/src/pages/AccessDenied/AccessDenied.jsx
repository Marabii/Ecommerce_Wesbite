import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Oops, the page you are looking for does not exist.</p>
      <p>Maybe you typed the wrong URL or followed a broken link.</p>
      <p>Don't worry, you can always go back to the <a href="/">home page</a> or try a <a href="/search">search</a>.</p>
    </div>
  );
};

export default NotFoundPage;
