import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = ['Cakes', 'Pastries', 'Bread'];

  return (
    <div className="container my-3">
      <h4>Categories</h4>
      <div className="d-flex gap-3">
        {categories.map(category => (
          <Link 
            key={category} 
            to={`/category/${category.toLowerCase()}`} 
            className="btn btn-outline-secondary"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
