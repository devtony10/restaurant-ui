import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAdminProductCategories } from "medusa-react"
import { ProductCategory } from "@medusajs/medusa";
import BodyCard from "../../../../components/organisms/body-card";
import TableViewHeader from "../../../../components/organisms/custom-table-header";
import { ProductTable } from "../../../../components/templates/product-table";

const Product = () => {
  // navigate
  
  const { 
    product_categories,
    isLoading 
  } = useAdminProductCategories({
    parent_category_id: "null",
    include_descendants_tree: true,
  })

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  useEffect(() => {
    if (product_categories && product_categories.length > 0) {
      setSelectedCategory(product_categories[0].name);
    }
  }, [product_categories]);

  const [category, setCategory] = useState<ProductCategory>(null);
  
  useEffect(() => {
    const category = product_categories? product_categories.find(category => category.name === selectedCategory) : null;
    if (category) {
      setCategory(category);
    }
  }, [selectedCategory]);

  // const categoryId = category? category.id : "";

  // toggle for a extra actions modal in mobile view

  // notification

  // look for where in the codebase we use hover

  return <>    
      <div className="flex w-full h-full grow flex-col">
        <BodyCard
          forceDropdown={false}
          customHeader={
            <TableViewHeader 
            views={product_categories?.map((category) => category.name) || []}
            setActiveView={setSelectedCategory}
            activeView={selectedCategory}
            />
          }
          className="h-full hover:overflow-y-auto"
          >
            <ProductTable {...category} />
        </BodyCard>
      </div>
  </>;
};

export default Product;

// TODO add filter: veg and non-veg
// TODO make width 60%

// set categories state
// loop over categories
