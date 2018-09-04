/**
 * Get first attribute from list by type
 * @method getFirstOfType
 * @param {array} attributes List of attributes
 * @param {string} type Attribute type
 * @returns {Object} First attribute of type
 */
export function getFirstOfType(attributes, type) {
  const list = attributes.filter(attribute => attribute.data && attribute.data.type === type);
  return list.length > 0 ? list[0] : null;
}

export default {
  getFirstOfType,
};
