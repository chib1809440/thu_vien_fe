
export interface ProducerStateProps {
  getProducer?: GetProducer[];
  getProducerLT?: GetProducerLT[];
  error?: object | string | null;
}

export interface GetProducer {
  producerId?: string;
  producerName?: string;
  producerDescription?: string;
};

export interface GetProducerLT {
  id?: string;
  publisherName?: string;
  publisherEmail?: string;
  publisherAddress?: string;
  publisherNote?: string;
  publisherContact?: string;
  user?: {
    schoolName?: string;
  }
};
