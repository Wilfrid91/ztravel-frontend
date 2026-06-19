import { TitleBlock } from './RenderingEngine/TitleBlock'
import { ParagraphBlock } from './RenderingEngine/ParagraphBlock'
import { NumberedSteps } from './RenderingEngine/NumberedSteps'
import { WarningBlock } from './RenderingEngine/WarningBlock'
import { QuoteBlock } from './RenderingEngine/QuoteBlock'
import { TableBlock } from './RenderingEngine/TableBlock'
import { CodeBlock } from './RenderingEngine/CodeBlock'
import { CalloutBlock } from './RenderingEngine/CalloutBlock'
import { ImageGallery } from './RenderingEngine/ImageGallery'
import { BulletList } from './RenderingEngine/BulletList'
import styles from '../css/RichRenderer.module.css'
//import { VideoBlock } from '../VideoBlock'

export default function RichRenderer({ data }) {
  return (
    <div className={styles.richContainer}>
      {data.title && <TitleBlock>{data.title}</TitleBlock>}
      {data.description && <ParagraphBlock>{data.description}</ParagraphBlock>}

      {console.log('REMARQUE =', data.remark)}
      {data.remark && (
        <CalloutBlock>
          <WarningBlock items={data.remark} />
        </CalloutBlock>
      )}
      {data.images && <ImageGallery images={data.images} />}
      {/*
      {data.video &&
        (Array.isArray(data.video) ? (
          data.video.map((url, i) => <VideoBlock key={i} url={url} />)
        ) : (
          <VideoBlock url={data.video} />
        ))}
      */}
      {data.steps && <NumberedSteps steps={data.steps} />}
      {data.quote && <QuoteBlock>{data.quote}</QuoteBlock>}
      {data.table && <TableBlock table={data.table} />}
      {console.log('ITEMS =', data.items)}
      {data.items && <BulletList items={data.items} />}
      {/*{data.code && <CodeBlock code={data.code} />} PAS DE VIDEO */}
    </div>
  )
}
