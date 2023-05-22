import * as Scrivito from 'scrivito'
import { HeadlineWidget } from './HeadlineWidgetClass'
import * as speakingUrl from 'speakingurl'

Scrivito.provideComponent(HeadlineWidget, ({ widget }) => {
  const style = widget.get('style') || 'h2'
  const level = widget.get('level') || style
  const classNames = [style]

  const alignment = alignmentClassName(widget.get('alignment'))
  if (alignment) classNames.push(alignment)

  return (
    <>
      <span
        className="headline-widget--anchor"
        id={speakingUrl(widget.get('headline'))}
      ></span>
      <Scrivito.ContentTag
        content={widget}
        attribute="headline"
        className={classNames.join(' ')}
        tag={level}
      />
    </>
  )
})

function alignmentClassName(
  widgetAlignment: string | null
): string | undefined {
  if (widgetAlignment === 'center') return 'text-center'
  if (widgetAlignment === 'right') return 'text-end'
}