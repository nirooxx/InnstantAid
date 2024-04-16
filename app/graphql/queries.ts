// queries.ts
import { gql } from '@apollo/client';

export const GET_RESERVATIONS = gql`
query Reservations($first: Int, $after: String) {
    reservations(first: $first, after: $after) {
      edges {
        node {
          id
          code
          bookingChannelCode
          pmsUrl
          status
          groupName
          client {
            id
            street
            zipcode
            city
            country
            language
            email
            telephone
            mobile
            fax
            preferences
            newsletterSubscriptionEnabled
            ... on Person {
              firstname
              lastname
            }
            ... on Company {
              company
            }
          }
          contact {
            firstname
            lastname
            email
            telephone
            mobile
          }
          selfcheckinStatus
          selfcheckinUrl
          bookingSource{
            name
          }
          bookingType{
            name
          }
          stayType{
            name
          }
          rooms {
            edges {
              node {
                id
                arrival: reservation_from
                departure: reservation_to
            
              }
            }
          }
          createdAt
          updatedAt
          notes
          deposits {
            edges {
              node {
                id
                amount
                paymentMethodName
                datetime
               paymentMethod{
                id
                name
                
              }
              }
            }
          }
          totalAmount
          openAmount
        }
      }
    }
  }
`;

export const GET_ROOM_STAYS = gql`
  query RoomStays($filter: RoomStayFilter, $first: Int, $after: String, $last: Int, $before: String) {
    room_stays(filter: $filter, first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          id
          reservation {
            id
            code
            groupName
            bookingChannelCode
            status
            client {
              id
              street
              zipcode
              city
              country
              language
              email
              telephone
              mobile
              preferences
            }
            contact {
              id
              firstname
              lastname
              email
              telephone
              mobile
              preferences
            }
          }
          room_setup {
            id
            name
            areaName
            cleaningStatus
            category {
              id
              name
              standardOccupancy
              minOccupancy
              maxOccupancy
              minimumRate
            }
          }
          roomName
          category {
            id
            name
            standardOccupancy
            minOccupancy
            maxOccupancy
            minimumRate
          }
          guests {
            id
            firstname
            lastname
          }
          first_guest {
            firstname
            lastname
          }
          gross
          dailyRates {
            edges {
              node {
                date
                amount
              }
            }
          }
          lodgingsGross
          additionalSales
          reservation_from
          reservation_to
          check_in
          check_out
          selfcheckout_enabled
          selfcheckout_url
          mealNotes
          maidNotes
          guestMessage
          ageGroups {
            adults
            child1
            child2
            free
          }
          createdAt
          updatedAt
          roomAccessKey {
            id
          }
        }
      }
    }
  }
`;
