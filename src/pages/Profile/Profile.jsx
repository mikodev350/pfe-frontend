import React from 'react'
import { ProfileHeader } from './ProfileHeader'
import { Experience,Education } from './Experience'
import { Bio} from './Bio'

import { Container,Row ,Col} from 'react-bootstrap'
import Layout from '../../components/layout/Layout'

export default function Profile() {
  return (
    <Layout fullcontent={true}>
        <ProfileHeader />
        <Bio />
        <Container>
          <Row>
            <Col sm={6}>
              <Experience />
            </Col>
            <Col sm={6}>
              <Education />
            </Col>
          </Row>
        </Container>
      </Layout>
  )
}
