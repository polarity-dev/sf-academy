import { useState, useEffect } from "react";
import Input from "./components/Input";
import classes from "./Parsed.module.css";

function Parsed() {
  const [pageData, setPageData] = useState({ data: [] });
  const [filters, setFilters] = useState("");

  useEffect(() => {
    async function innerEffect() {
      console.log("test");
      const response = await fetch("http://localhost:5001/data");
      const data = await response.json();
      setPageData(data);
    }
    innerEffect();
  }, []);

  const filterHandler = async (data) => {
    console.log(data);
    let localFilter;
    if (data.from !== "" && data.limit !== "") {
      localFilter = `&from=${data.from}&limit=${data.limit}&order=${data.select}`
      setFilters(`&from=${data.from}&limit=${data.limit}&order=${data.select}`);
    } else if (data.from !== "") {
      localFilter = `&from=${data.from}&order=${data.select}`
      setFilters(`&from=${data.from}&order=${data.select}`);
    } else if (data.limit !== "") {
      localFilter = `&limit=${data.limit}&order=${data.select}`
      setFilters(`&limit=${data.limit}&order=${data.select}`);
    } else {
      localFilter = `&order=${data.select}`
      setFilters(`&order=${data.select}`);
    }
    console.log(filters);
    const response = await fetch(
      "http://localhost:5001/data?page=" + pageData.current + localFilter
    );
    const filtersResponse = await response.json();
    setPageData(filtersResponse);
  };

  const getNewPage = async (page) => {
    const queryPage =
      page === "old" ? pageData.current - 1 : pageData.current + 1;
    const response = await fetch(
      "http://localhost:5001/data?page=" + queryPage + filters
    );
    const data = await response.json();
    setPageData(data);
  };

  return (
    <div className={classes.container}>
      <div className={classes.title}>View Parsed</div>
      <div className={classes.filters}>
        <Input onFilter={(data) => filterHandler(data)} />
      </div>
      <div className={classes["table-container"]}>
        <div className={classes["row-first"]}>
          <div className={classes.number}>Number</div>
          <div className={classes.string}>String</div>
          <div className={classes.stamp}>Timestamp</div>
        </div>
        {pageData.data.map((element) => (
          <div key={element.id} className={classes.row}>
            <div className={classes.number}>{element.number}</div>
            <div className={classes.string}>{element.string}</div>
            <div className={classes.stamp}>{element.parsedAt}</div>
          </div>
        ))}
      </div>
      <div className={classes.pages}>
        <div
          className={classes.page}
          style={{ color: pageData.current === 1 ? "#d9dfe6" : "black" }}
          onClick={pageData.current === 1 ? undefined : () => getNewPage("old")}
        >
          {"<"}
        </div>
        <div className={classes.page}>{pageData.current}</div>
        <div
          className={classes.page}
          style={{
            color: pageData.pages === pageData.current ? "#d9dfe6" : "black",
          }}
          onClick={
            pageData.pages === pageData.current
              ? undefined
              : () => getNewPage("new")
          }
        >
          {">"}
        </div>
      </div>
    </div>
  );
}

export default Parsed;
