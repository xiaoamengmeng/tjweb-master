export const getMeu = (menuss, name) => {
  let pushName = "";
  for (let i = 0; i < menuss.length; i++) {
    const element = menuss[i];
    if (element.meta.codename === name) {
      pushName = element.name;
      break;
    }
    if (element.children) {
      const pushName1 = getMeu(element.children, name);
      if (pushName1) {
        pushName = pushName1;
        break;
      }
    }
  }
  return pushName;
};

export const getRoutes = (info, pathName = ["list"]) => {
  let list = [];
  info.forEach((ele) => {
    const names = ele.codename.split(".");
    if (names.length > 1 && pathName.includes(names[1])) {
      list.push(ele.codename);
    }
    if (ele.items) {
      const items = getRoutes(ele.items);
      list = list.concat(items);
    }
  });
  return list;
};
