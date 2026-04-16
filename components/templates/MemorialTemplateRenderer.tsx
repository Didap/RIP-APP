import ClassicTemplate from './ClassicTemplate';
import ElegantTemplate from './ElegantTemplate';
import ModernTemplate from './ModernTemplate';
import type { MemorialDetail } from '../../services/api';

interface Props {
  memorial: MemorialDetail;
}

export default function MemorialTemplateRenderer({ memorial }: Props) {
  switch (memorial.template) {
    case 'elegant': return <ElegantTemplate memorial={memorial} />;
    case 'modern': return <ModernTemplate memorial={memorial} />;
    default: return <ClassicTemplate memorial={memorial} />;
  }
}
