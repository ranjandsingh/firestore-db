function getSingleData(doc) {
  const data = doc.data();
  return { id: doc.id, ...data };
}

function getMultipleData(collection) {
  const data = [];
  collection.forEach((doc) => {
    data.push(getSingleData(doc));
  });
  return data;
}

function queryParser(query, params) {
  if (params.where) {
    if (Array.isArray(params.where)) {
      params.where.forEach((condition) => {
        // ['user', 'in', [1,2,3]]
        query = query.where(...condition);
      });
    } else {
      // { user: 3, isVisible: true }
      Object.keys(condition).forEach((key) => {
        const itemValue = condition[key];
        if (
          typeof itemValue === "object" &&
          !Array.isArray(itemValue) &&
          itemValue !== null
        )
          // { user: { ">=": 20 } }
          query = query.where(
            key,
            Object.keys(itemValue)[0],
            Object.values(itemValue)[0]
          );
        else if (Array.isArray(itemValue))
          // { user: [1,2,3] }
          query = query.where(key, "in", itemValue);
        // { user: 3 }
        else query = query.where(key, "=", itemValue);
      });
    }
  }

  if (params.orderBy) {
    if (typeof params.orderBy === "string") {
      // { orderBy: 'createdAt' }
      query = query.orderBy(params.orderBy);
    } else if (Array.isArray(params.orderBy)) {
      // { orderBy: ['createdAt', 'asc'] }
      if (typeof params.orderBy[0] === "string") {
        query = query.orderBy(...params.orderBy);
      } else if (Array.isArray(params.orderBy)) {
        // { orderBy: [['user', 'desc'], ['createdAt', 'asc']] }
        params.orderBy.forEach((x) => {
          query = query.orderBy(...x);
        });
      }
    }
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  return query;
}

function queryBuilder(dbRef) {
  const findOne = async (params) => find({ ...params, limit: 1 });
  const find = async (params) => {
    let query = queryParser(dbRef, params);
    const snapshot = await query.get();

    const data = getMultipleData(snapshot);

    if (params.limit === 1) {
      if (data.length === 1) {
        return data[0];
      } else if (data.length === 0) {
        return null;
      } else {
        return data;
      }
    } else {
      return data;
    }
  };
  const search = async (key, searchTerm) => {
    let query = dbRef;
    const snapshot = await query
      .where(key, ">=", searchTerm)
      .where(key, "<=", queryText + "\uf8ff")
      .get();

    const data = getMultipleData(snapshot);
    return data;
  };
  const findById = async (id) => getSingleData(dbRef.doc(id).get());
  const create = async (data) => dbRef.add(data);
  const update = async (id, data) => dbRef.doc(id).update(data);
  const deleteOne = async (id) => dbRef.doc(id).delete();
  const deleteMany = async (ids) => dbRef.where("id", "in", ids).delete();
  return this;
}

module.exports = {
  getSingleData,
  getMultipleData,
  queryBuilder,
};
