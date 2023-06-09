const isEscapeKey = (evt) => evt.key === 'Escape';

const getOffersByType = (offers, type) => offers.find((offer) => offer.type === type);

export {isEscapeKey, getOffersByType};
