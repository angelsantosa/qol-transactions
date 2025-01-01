const App = () => {
  return (
    <>
      <header
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <h1>Mobile First Layout</h1>
      </header>
      <section
        style={{
          padding: '.5rem',
        }}
      >
        <h2>Content Section</h2>
        <p>
          This layout maintains mobile dimensions (320px-420px) across all
          screen sizes while staying centered on larger screens.
        </p>
      </section>
    </>
  );
};

export default App;
