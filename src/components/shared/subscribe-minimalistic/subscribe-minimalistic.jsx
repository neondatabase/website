import Container from 'components/shared/container';
import SubscriptionForm from 'components/shared/subscription-form';
import { HUBSPOT_NEWSLETTERS_FORM_ID } from 'constants/forms';

const SubscribeMinimalistic = () => (
  <section className="safe-paddings py-32 2xl:py-28 xl:py-20 lg:py-16 lg:text-center">
    <Container
      className="flex items-center justify-center space-x-14 lg:block lg:space-x-0 lg:space-y-7"
      size="md"
    >
      <h2 className="t-5xl font-bold leading-tight">Subscribe to our newsletter</h2>
      <SubscriptionForm
        className="lg:!mx-auto"
        formId={HUBSPOT_NEWSLETTERS_FORM_ID}
        localStorageKey="submittedEmailNewsletterForm"
      />
    </Container>
  </section>
);

export default SubscribeMinimalistic;
