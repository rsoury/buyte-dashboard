export const checkout = `
    id
    label
    description
    connection {
        id
        isTest
        provider {
            id
            name
            image
        }
        type
        credentials
    }
    paymentOptions {
        items {
            id
            paymentOption{
                id
                name
                image
            }
        }
    }
    version
`;

export const location = `
    id
    address1
    address2
    city
    postalCode
    country
    state
`;

export const shippingOrigin = `
    id
    location {
      ${location}
    }
`;

export const shippingZone = `
    id
    name
    countries {
        iso
        name
    }
`;
export const priceRate = `
    id
    label
    description
    minOrderPrice
    maxOrderPrice
    rate
`;
