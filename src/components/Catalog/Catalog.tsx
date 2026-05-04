import {Title} from "@mantine/core";
import ky from 'ky'
import {useEffect, useState} from "react";
import CardElem from "../Card/CardElem.tsx";
import CardSkeleton from "../CardSkeleton/CardSkeleton.tsx";
import styles from './Catalog.module.css';

type Product = {
  id: number
  name: string
  price: number
  image: string
}

const Catalog = () => {
  const [vegs, setVegs] = useState<Product []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getData() {
      try {
        const data = await ky.get('https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json').json<Product[]>()

        setVegs(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  console.log(vegs)

  return (
    <div className={styles.catalog}>
      <div className="container">
        <Title order={2}>Catalog</Title>
        <ul className={styles.catalog__list}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
              <li key={i}>
                <CardSkeleton />
              </li>
            ))
            : vegs.map(i => (
              <li key={i.id}>
                <CardElem
                  id={i.id}
                  name={i.name}
                  price={i.price}
                  image={i.image}
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Catalog;