// Basic query helper for filter / sort / pagination / search
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.qs = queryString || {};
  }

  filter() {
    const q = { ...this.qs };
    ['page', 'sort', 'limit', 'fields', 'search'].forEach((f) => delete q[f]);
    let str = JSON.stringify(q);
    str = str.replace(/\b(gte|gt|lte|lt|in)\b/g, (m) => `$${m}`);
    this.query = this.query.find(JSON.parse(str));
    return this;
  }

  search(fields = []) {
    if (this.qs.search) {
      const regex = new RegExp(this.qs.search, 'i');
      const or = fields.map((f) => ({ [f]: regex }));
      if (or.length) this.query = this.query.find({ $or: or });
    }
    return this;
  }

  sort() {
    if (this.qs.sort) {
      this.query = this.query.sort(this.qs.sort.split(',').join(' '));
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  fields() {
    if (this.qs.fields) {
      this.query = this.query.select(this.qs.fields.split(',').join(' '));
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.qs.page, 10) || 1;
    const limit = Math.min(parseInt(this.qs.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }
}

module.exports = ApiFeatures;
