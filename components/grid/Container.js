/*
 * Container component which includes masonry container with column inside
 */

const Container = ({ xs = 12, sm, md, lg, children, className }) => {
  const colClassNames = () => {
    const classList = [`col-xs-${xs}`];
    if (sm) classList.push(`col-sm-${sm}`);
    if (md) classList.push(`col-md-${md}`);
    if (lg) classList.push(`col-lg-${lg}`);

    return classList;
  };

  return (
    <div style={{ position: "relative" }} className={`container ${className}`}>
      <div className="grid">
        <div
          style={{ margin: "0 auto" }}
          className={`grid-item ${colClassNames()}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Container;
