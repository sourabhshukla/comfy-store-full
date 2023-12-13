async function upload() {
  let count = 0;
  let response = await fetch(
    "https://strapi-store-server.onrender.com/api/products"
  );
  let allProducts = await response.json();
  count += allProducts.data.length;

  allProducts.data.forEach(async (data) => {
    //console.log(data);
    let image_url = data.attributes.image;
    delete data.attributes.image;
    data.attributes.images = [
      {
        public_id: "null",
        url: image_url,
      },
    ];
    response = await fetch("http://localhost:4000/api/v1/products/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data.attributes),
    });
    let data1 = await response.json();
    console.log(data1);
  });

  response = await fetch(
    "https://strapi-store-server.onrender.com/api/products?page=2"
  );
  allProducts = await response.json();
  count += allProducts.data.length;

  allProducts.data.forEach(async (data) => {
    //console.log(data);
    let image_url = data.attributes.image;
    delete data.attributes.image;
    data.attributes.images = [
      {
        public_id: "null",
        url: image_url,
      },
    ];
    response = await fetch("http://localhost:4000/api/v1/products/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data.attributes),
    });
    let data1 = await response.json();
    console.log(data1);
  });

  response = await fetch(
    "https://strapi-store-server.onrender.com/api/products?page=3"
  );
  allProducts = await response.json();
  count += allProducts.data.length;

  allProducts.data.forEach(async (data) => {
    //console.log(data);
    let image_url = data.attributes.image;
    delete data.attributes.image;
    data.attributes.images = [
      {
        public_id: "null",
        url: image_url,
      },
    ];
    response = await fetch("http://localhost:4000/api/v1/products/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data.attributes),
    });
    let data1 = await response.json();
    console.log(data1);
  });

  //console.log(allProducts.data[0]);
  console.log(count);
}

upload();
