// types.ts: the shape of the data, written once and imported everywhere.
//
// This mirrors the Java entity on the server (api/.../Customer.java):
//   Long id                    -> number
//   String name / email        -> string
//   OffsetDateTime createdAt   -> string (JSON sends ISO text) and null
//                                 (the POST response has it null; the database fills it in)
export interface Customer {
  id: number
  name: string
  email: string
  createdAt: string | null
}

// What the form sends: a customer before the server has given it an id.
export type CustomerInput = Pick<Customer, 'name' | 'email'>
